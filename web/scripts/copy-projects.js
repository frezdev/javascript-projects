import fs from 'node:fs/promises'

fs.cp(`../projects/`, `public/projects`, { recursive: true })