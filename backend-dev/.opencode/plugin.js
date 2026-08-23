/**
 * OpenCode adapter for this Claude Code plugin.
 * Registers skills/, agents/, and commands/ — no bootstrap.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const skillsDir = path.join(root, "skills")
const agentsDir = path.join(root, "agents")
const commandsDir = path.join(root, "commands")

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
      prompt: body.trim(),
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
        // OpenCode requires provider/model; bare Claude aliases are skipped
        if (m.includes("/")) agent.model = m
        continue
      }
      agent[key] = data[key]
    }

    // Bare name (OpenCode native) + plugin:name alias (Claude-style skill refs)
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

    const cmd = { template: body.trim() }
    if (data.description) cmd.description = String(data.description).trim()
    for (const key of COMMAND_KEYS) {
      if (key === "description") continue
      if (data[key] === undefined || data[key] === "") continue
      cmd[key] = data[key]
    }
    config.command[name] = cmd
  }
}

export default async () => {
  return {
    config: async (config) => {
      if (fs.existsSync(skillsDir)) {
        config.skills = config.skills || {}
        config.skills.paths = config.skills.paths || []
        pushUnique(config.skills.paths, skillsDir)
      }
      loadAgents(config)
      loadCommands(config)
    },
  }
}
