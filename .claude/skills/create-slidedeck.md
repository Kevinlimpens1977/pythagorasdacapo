# Create Slidedeck from NotebookLM

Generate a professional slide deck from a NotebookLM notebook, export as PDF, and optionally upload to your learning platform.

## Usage

```
/create-slidedeck <notebook-name-or-id> [description]
```

## Examples

```
/create-slidedeck "stelling van pythagoras" "Include interactive geometry examples"
/create-slidedeck "d6bcaa5e-63a1-48be-b8b4-f55a8996b544"
/create-slidedeck pythagoras
```

## What It Does

1. ✅ Authenticates with NotebookLM
2. ✅ Finds your notebook by name or ID
3. ✅ Creates a slide deck with your description
4. ✅ Exports as PDF to `./exports/`
5. ✅ Shows the file path for next steps

## Output

The PDF is saved to: `./exports/<artifact-id>.pdf`

You can then use it in your learning platform or share with students.

## Full Notebooks List

Run this to see all 79 of your notebooks:

```bash
python notebooklm_cli.py list
```

## Troubleshooting

- **"Notebook not found"**: Check the exact name in `/create-slidedeck pythagoras` or use the full ID
- **Auth error**: Run `python -m notebooklm login` to re-authenticate
