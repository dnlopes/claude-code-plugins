/**
 * OpenCode adapter for this Claude Code plugin.
 * Registers skills/, agents/, commands/, optional MCP, and Claude-compatible hooks.
 * No marketplace-wide skill bootstrap.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const skillsDir = path.join(root, "skills")
const agentsDir = path.join(root, "agents")
const commandsDir = path.join(root, "commands")
const mcpPath = path.join(root, ".mcp.json")
const hooksDir = path.join(root, "hooks")

const THEME_COLORS = new Set([
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
])

const AGENT_KEYS = new Set([
  "description",
  "mode",
  "model",
  "temperature",
  "top_p",
  "color",
  "hidden",
  "steps",
  "disable",
  "variant",
])

const COMMAND_KEYS = new Set(["description", "agent", "model", "variant", "subtask"])

const EDIT_TOOLS = new Set(["edit", "write", "apply_patch", "multiedit"])

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw }
  }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) {
    return { data: {}, body: raw }
  }
  const fm = raw.slice(4, end)
  let body = raw.slice(end + 4)
  if (body.startsWith("\n")) body = body.slice(1)

  const data = {}
  const lines = fm.split("\n")
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!m) {
      i++
      continue
    }
    const key = m[1]
    let val = m[2]
    if (val === "|" || val === ">") {
      const block = []
      i++
      while (i < lines.length) {
        const l = lines[i]
        if (l === "" || l.startsWith("  ") || l.startsWith("\t")) {
          block.push(l.replace(/^  /, ""))
          i++
          continue
        }
        break
      }
      data[key] = block.join("\n").trim()
      continue
    }
    if (
      (val.startsWith("[") && val.endsWith("]")) ||
      (val.startsWith("{") && val.endsWith("}"))
    ) {
      try {
        data[key] = JSON.parse(val.replace(/'/g, '"'))
      } catch {
        data[key] = val
      }
      i++
      continue
    }
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (val === "true") data[key] = true
    else if (val === "false") data[key] = false
    else if (val !== "" && !Number.isNaN(Number(val)) && /^-?\d+(\.\d+)?$/.test(val)) {
      data[key] = Number(val)
    } else data[key] = val
    i++
  }
  return { data, body }
}

function pushUnique(list, value) {
  if (!list.includes(value)) list.push(value)
}

function pluginName() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
    if (pkg.name && pkg.name.startsWith("@dnlopes/")) {
      return pkg.name.slice("@dnlopes/".length)
    }
  } catch {
    /* ignore */
  }
  return path.basename(root)
}

function expandPluginRoot(text) {
  return text
    .split("${CLAUDE_PLUGIN_ROOT}")
    .join(root)
    .split("$CLAUDE_PLUGIN_ROOT")
    .join(root)
}

function loadAgents(config) {
  if (!fs.existsSync(agentsDir)) return
  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"))
  if (!files.length) return
  config.agent = config.agent || {}
  const plugin = pluginName()

  for (const file of files) {
    const raw = fs.readFileSync(path.join(agentsDir, file), "utf8")
    const { data, body } = parseFrontmatter(raw)
    const name = (data.name || path.basename(file, ".md")).trim()
    if (!name || !body.trim()) continue

    const agent = {
      mode: data.mode || "subagent",
      prompt: expandPluginRoot(body.trim()),
    }
    if (data.description) agent.description = String(data.description).trim()
    else agent.description = `Subagent: ${name}`

    for (const key of AGENT_KEYS) {
      if (key === "description" || key === "mode") continue
      if (data[key] === undefined || data[key] === "") continue
      if (key === "color") {
        const c = String(data[key])
        if (THEME_COLORS.has(c) || /^#[0-9a-fA-F]{6}$/.test(c)) agent.color = c
        continue
      }
      if (key === "model") {
        const m = String(data[key])
        if (m.includes("/")) agent.model = m
        continue
      }
      agent[key] = data[key]
    }

    for (const key of [name, `${plugin}:${name}`]) {
      if (!config.agent[key]) {
        config.agent[key] = { ...agent }
      }
    }
  }
}

function loadCommands(config) {
  if (!fs.existsSync(commandsDir)) return
  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".md"))
  if (!files.length) return
  config.command = config.command || {}

  for (const file of files) {
    const raw = fs.readFileSync(path.join(commandsDir, file), "utf8")
    const { data, body } = parseFrontmatter(raw)
    const name = path.basename(file, ".md")
    if (!name || !body.trim()) continue
    if (config.command[name]) continue

    const cmd = { template: expandPluginRoot(body.trim()) }
    if (data.description) cmd.description = String(data.description).trim()
    for (const key of COMMAND_KEYS) {
      if (key === "description") continue
      if (data[key] === undefined || data[key] === "") continue
      cmd[key] = data[key]
    }
    config.command[name] = cmd
  }
}

function loadMcp(config) {
  if (!fs.existsSync(mcpPath)) return
  let raw
  try {
    raw = JSON.parse(fs.readFileSync(mcpPath, "utf8"))
  } catch {
    return
  }
  const servers = raw.mcpServers || raw.mcp || raw
  if (!servers || typeof servers !== "object") return
  config.mcp = config.mcp || {}

  for (const [name, server] of Object.entries(servers)) {
    if (config.mcp[name] || !server || typeof server !== "object") continue
    const type = server.type
    if (type === "http" || type === "sse" || type === "remote") {
      if (!server.url) continue
      config.mcp[name] = {
        type: type === "http" || type === "sse" ? "remote" : type,
        url: server.url,
        enabled: server.enabled !== false,
        ...(server.headers ? { headers: server.headers } : {}),
        ...(server.oauth !== undefined ? { oauth: server.oauth } : {}),
        ...(server.timeout ? { timeout: server.timeout } : {}),
      }
      continue
    }
    if (type === "stdio" || type === "local" || Array.isArray(server.command)) {
      const command = Array.isArray(server.command)
        ? server.command
        : server.command
          ? [server.command, ...(server.args || [])]
          : null
      if (!command) continue
      config.mcp[name] = {
        type: "local",
        command,
        enabled: server.enabled !== false,
        ...(server.environment || server.env
          ? { environment: server.environment || server.env }
          : {}),
        ...(server.cwd ? { cwd: server.cwd } : {}),
        ...(server.timeout ? { timeout: server.timeout } : {}),
      }
    }
  }
}

function hasCuratorHook() {
  return fs.existsSync(path.join(hooksDir, "staleness-reminder.py"))
}

function hasVoiceHook() {
  return fs.existsSync(path.join(hooksDir, "suggest-comment-discipline.sh"))
}

function editedPathsFromTool(tool, args) {
  if (!args || typeof args !== "object") return []
  if (tool === "multiedit" && Array.isArray(args.filePaths)) return args.filePaths
  const candidates = [args.filePath, args.path, args.file, args.file_path]
  return candidates.filter((p) => typeof p === "string" && p.length > 0)
}

function runCuratorHook({ tool, args, directory, sessionId }) {
  const script = path.join(hooksDir, "staleness-reminder.py")
  if (!fs.existsSync(script)) return Promise.resolve()

  const paths = editedPathsFromTool(tool, args)
  if (!paths.length) return Promise.resolve()

  const payload = {
    session_id: sessionId || "opencode",
    tool_name: paths.length > 1 ? "MultiEdit" : "Edit",
    tool_input:
      paths.length > 1
        ? { filePaths: paths }
        : { file_path: paths[0] },
  }

  return new Promise((resolve) => {
    const child = spawn("python3", [script], {
      cwd: directory || process.cwd(),
      env: {
        ...process.env,
        CLAUDE_PLUGIN_ROOT: root,
        CLAUDE_PROJECT_DIR: directory || process.cwd(),
      },
      stdio: ["pipe", "pipe", "pipe"],
    })
    let stdout = ""
    child.stdout.on("data", (d) => {
      stdout += d.toString()
    })
    child.on("error", () => resolve())
    child.on("close", () => {
      const msg = stdout.trim()
      if (msg) {
        // Surface as tool output appendix when possible
        resolve(msg)
      } else {
        resolve()
      }
    })
    child.stdin.write(JSON.stringify(payload))
    child.stdin.end()
  })
}

export default async (ctx = {}) => {
  const directory = ctx.directory || process.cwd()
  const plugin = pluginName()
  let voiceInjected = false
  let sessionId = "opencode"

  const hooks = {
    config: async (config) => {
      if (fs.existsSync(skillsDir)) {
        config.skills = config.skills || {}
        config.skills.paths = config.skills.paths || []
        pushUnique(config.skills.paths, skillsDir)
      }
      loadAgents(config)
      loadCommands(config)
      loadMcp(config)
    },

    "shell.env": async (_input, output) => {
      output.env = output.env || {}
      output.env.CLAUDE_PLUGIN_ROOT = root
      output.env.CLAUDE_PROJECT_DIR = directory
      output.env.OPENCODE_PLUGIN_ROOT = root
      output.env.OPENCODE_PLUGIN_NAME = plugin
    },
  }

  if (hasVoiceHook()) {
    const suggestion =
      "Load the comment-discipline skill before writing or editing code this session. Comments are only for non-obvious nuances — never restate the code, never narrate the current task or decision, never applied as a systematic habit."

    hooks["experimental.chat.messages.transform"] = async (_input, output) => {
      if (voiceInjected || !output.messages?.length) return
      const firstUser = output.messages.find((m) => m.info?.role === "user")
      if (!firstUser?.parts?.length) return
      if (
        firstUser.parts.some(
          (p) => p.type === "text" && p.text?.includes("comment-discipline skill"),
        )
      ) {
        voiceInjected = true
        return
      }
      const ref = firstUser.parts[0]
      firstUser.parts.unshift({
        ...ref,
        type: "text",
        text: `<plugin-hint source="voice">\n${suggestion}\n</plugin-hint>\n`,
      })
      voiceInjected = true
    }
  }

  if (hasCuratorHook()) {
    hooks.event = async ({ event }) => {
      if (event?.type === "session.created" && event?.properties?.sessionID) {
        sessionId = event.properties.sessionID
      }
    }

    hooks["tool.execute.after"] = async (input, output) => {
      const tool = String(input.tool || "").toLowerCase()
      if (!EDIT_TOOLS.has(tool)) return
      const args = output?.args || input?.args || {}
      const msg = await runCuratorHook({
        tool,
        args,
        directory,
        sessionId,
      })
      if (msg && output && typeof output === "object") {
        if (typeof output.output === "string") {
          output.output = `${output.output}\n\n${msg}`
        } else if (output.output == null) {
          output.output = msg
        }
      }
    }
  }

  return hooks
}
