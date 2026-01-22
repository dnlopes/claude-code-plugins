# Taskfile Templating Reference

Taskfile uses Go's `text/template` with Sprig functions. Templates use `{{}}` syntax.

## Special Variables

### CLI Variables
| Variable | Type | Description |
|----------|------|-------------|
| `CLI_ARGS` | string | Arguments after `--` as string |
| `CLI_ARGS_LIST` | []string | Arguments as list |
| `CLI_FORCE` | bool | `--force` flag |
| `CLI_SILENT` | bool | `--silent` flag |
| `CLI_VERBOSE` | bool | `--verbose` flag |
| `CLI_OFFLINE` | bool | `--offline` flag |
| `CLI_ASSUME_YES` | bool | `--yes` flag |

### Task Variables
| Variable | Description |
|----------|-------------|
| `TASK` | Current task name |
| `ALIAS` | Alias used (falls back to TASK) |
| `TASK_EXE` | Task executable name/path |
| `TASK_VERSION` | Task CLI version |

### Path Variables
| Variable | Description |
|----------|-------------|
| `ROOT_TASKFILE` | Path to root Taskfile |
| `ROOT_DIR` | Directory of root Taskfile |
| `TASKFILE` | Path to current Taskfile (for includes) |
| `TASKFILE_DIR` | Directory of current Taskfile |
| `TASK_DIR` | Task execution directory |
| `USER_WORKING_DIR` | Where task was invoked |

### Status Variables
| Variable | Description |
|----------|-------------|
| `CHECKSUM` | File checksum (in status context) |
| `TIMESTAMP` | Latest file timestamp (in status context) |

### Loop Variables
| Variable | Description |
|----------|-------------|
| `ITEM` | Current iteration value |

### Error Variables
| Variable | Description |
|----------|-------------|
| `EXIT_CODE` | Failed command exit code (in defer) |

## Template Syntax

### Variable Access
```yaml
cmds:
  - echo {{.MY_VAR}}
  - echo {{.NESTED.KEY}}
```

### Conditionals
```yaml
cmds:
  - '{{if .DEBUG}}echo "Debug mode"{{end}}'
  - '{{if eq .ENV "prod"}}deploy{{else}}build{{end}}'
```

### Loops
```yaml
cmds:
  - '{{range .ITEMS}}echo {{.}}; {{end}}'
```

### Pipes
```yaml
cmds:
  - echo {{.NAME | upper | quote}}
```

## String Functions

| Function | Description | Example |
|----------|-------------|---------|
| `trim` | Remove whitespace | `{{trim " hi "}}` → `hi` |
| `trimAll` | Remove specific chars | `{{trimAll "x" "xhix"}}` → `hi` |
| `trimPrefix` | Remove prefix | `{{trimPrefix "pre_" "pre_name"}}` |
| `trimSuffix` | Remove suffix | `{{trimSuffix ".txt" "file.txt"}}` |
| `upper` | Uppercase | `{{upper "hi"}}` → `HI` |
| `lower` | Lowercase | `{{lower "HI"}}` → `hi` |
| `title` | Title case | `{{title "hi there"}}` → `Hi There` |
| `repeat` | Repeat string | `{{repeat 3 "x"}}` → `xxx` |
| `substr` | Substring | `{{substr 0 3 "hello"}}` → `hel` |
| `trunc` | Truncate | `{{trunc 3 "hello"}}` → `hel` |
| `contains` | Check substring | `{{contains "ell" "hello"}}` → `true` |
| `hasPrefix` | Check prefix | `{{hasPrefix "he" "hello"}}` → `true` |
| `hasSuffix` | Check suffix | `{{hasSuffix "lo" "hello"}}` → `true` |
| `replace` | Replace string | `{{replace "o" "0" "hello"}}` → `hell0` |
| `quote` | Add quotes | `{{quote "hi"}}` → `"hi"` |
| `shellQuote` | Shell-safe quote | `{{shellQuote "a b"}}` → `'a b'` |

## Regex Functions

| Function | Description | Example |
|----------|-------------|---------|
| `regexMatch` | Test match | `{{regexMatch "^[a-z]+$" "hello"}}` |
| `regexFind` | First match | `{{regexFind "[0-9]+" "abc123"}}` → `123` |
| `regexFindAll` | All matches | `{{regexFindAll "[0-9]+" "a1b2" -1}}` |
| `regexReplaceAll` | Replace all | `{{regexReplaceAll "[0-9]" "a1b2" "X"}}` → `aXbX` |

## List Functions

| Function | Description | Example |
|----------|-------------|---------|
| `list` | Create list | `{{list "a" "b" "c"}}` |
| `first` | First element | `{{first .ITEMS}}` |
| `last` | Last element | `{{last .ITEMS}}` |
| `rest` | All except first | `{{rest .ITEMS}}` |
| `initial` | All except last | `{{initial .ITEMS}}` |
| `append` | Add to list | `{{append .ITEMS "x"}}` |
| `prepend` | Add to front | `{{prepend .ITEMS "x"}}` |
| `concat` | Merge lists | `{{concat .A .B}}` |
| `uniq` | Remove duplicates | `{{uniq .ITEMS}}` |
| `without` | Remove values | `{{without .ITEMS "x"}}` |
| `has` | Check membership | `{{has "x" .ITEMS}}` |
| `sortAlpha` | Sort strings | `{{sortAlpha .ITEMS}}` |
| `reverse` | Reverse list | `{{reverse .ITEMS}}` |
| `join` | Join to string | `{{join "," .ITEMS}}` |
| `splitList` | Split string | `{{splitList "," "a,b,c"}}` |
| `splitLines` | Split by newline | `{{splitLines .TEXT}}` |

## Math Functions

| Function | Description | Example |
|----------|-------------|---------|
| `add` | Addition | `{{add 1 2}}` → `3` |
| `sub` | Subtraction | `{{sub 5 2}}` → `3` |
| `mul` | Multiplication | `{{mul 2 3}}` → `6` |
| `div` | Division | `{{div 6 2}}` → `3` |
| `mod` | Modulo | `{{mod 5 2}}` → `1` |
| `max` | Maximum | `{{max 1 5 3}}` → `5` |
| `min` | Minimum | `{{min 1 5 3}}` → `1` |
| `randInt` | Random int [min,max] | `{{randInt 1 100}}` |

## Logic Functions

| Function | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `{{eq .A .B}}` |
| `ne` | Not equal | `{{ne .A .B}}` |
| `lt` | Less than | `{{lt .A .B}}` |
| `le` | Less or equal | `{{le .A .B}}` |
| `gt` | Greater than | `{{gt .A .B}}` |
| `ge` | Greater or equal | `{{ge .A .B}}` |
| `and` | Logical AND | `{{and .A .B}}` |
| `or` | Logical OR | `{{or .A .B}}` |
| `not` | Logical NOT | `{{not .A}}` |
| `empty` | Check empty | `{{empty .VAR}}` |
| `default` | Default value | `{{default "x" .VAR}}` |
| `coalesce` | First non-empty | `{{coalesce .A .B "default"}}` |

## Data Functions

| Function | Description | Example |
|----------|-------------|---------|
| `dict` | Create map | `{{dict "k1" "v1" "k2" "v2"}}` |
| `get` | Get map value | `{{get .MAP "key"}}` |
| `keys` | Map keys | `{{keys .MAP}}` |
| `hasKey` | Check key | `{{hasKey .MAP "key"}}` |
| `merge` | Merge maps | `{{merge .A .B}}` |
| `len` | Length | `{{len .ITEMS}}` |
| `index` | Index access | `{{index .ITEMS 0}}` |

## Encoding Functions

| Function | Description | Example |
|----------|-------------|---------|
| `toJson` | To JSON | `{{toJson .DATA}}` |
| `toPrettyJson` | Pretty JSON | `{{toPrettyJson .DATA}}` |
| `fromJson` | Parse JSON | `{{fromJson .JSON_STR}}` |
| `toYaml` | To YAML | `{{toYaml .DATA}}` |
| `fromYaml` | Parse YAML | `{{fromYaml .YAML_STR}}` |
| `b64enc` | Base64 encode | `{{b64enc "hello"}}` |
| `b64dec` | Base64 decode | `{{b64dec .ENCODED}}` |

## Path Functions

| Function | Description | Example |
|----------|-------------|---------|
| `joinPath` | Join paths | `{{joinPath .DIR "file.txt"}}` |
| `relPath` | Relative path | `{{relPath .BASE .TARGET}}` |
| `toSlash` | Convert to / | `{{toSlash .PATH}}` |
| `fromSlash` | Convert from / | `{{fromSlash .PATH}}` |

## System Functions

| Function | Description | Example |
|----------|-------------|---------|
| `OS` | Operating system | `{{OS}}` → `linux` |
| `ARCH` | Architecture | `{{ARCH}}` → `amd64` |
| `numCPU` | CPU count | `{{numCPU}}` |

## Date Functions

| Function | Description | Example |
|----------|-------------|---------|
| `now` | Current time | `{{now}}` |
| `date` | Format date | `{{now \| date "2006-01-02"}}` |
| `toDate` | Parse date | `{{toDate "2006-01-02" "2024-01-15"}}` |
| `unixEpoch` | Unix timestamp | `{{now \| unixEpoch}}` |
| `ago` | Duration since | `{{ago .TIME}}` |

## Type Conversion

| Function | Description | Example |
|----------|-------------|---------|
| `atoi` | String to int | `{{atoi "42"}}` |
| `float64` | To float | `{{float64 "3.14"}}` |
| `toStrings` | To string list | `{{toStrings .ITEMS}}` |
| `toString` | To string | `{{toString 42}}` |

## Utility Functions

| Function | Description | Example |
|----------|-------------|---------|
| `uuid` | Generate UUID | `{{uuid}}` |
| `print` | Concatenate | `{{print "a" "b"}}` → `ab` |
| `printf` | Format string | `{{printf "%s-%d" .NAME .NUM}}` |
| `println` | Print with newline | `{{println "hi"}}` |
