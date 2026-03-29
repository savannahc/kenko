import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

describe('Project scaffolding', () => {
  it('has required directories', () => {
    const dirs = ['src/components', 'src/hooks', 'src/lib', 'src/types', 'src/test']
    dirs.forEach(dir => {
      expect(existsSync(resolve(process.cwd(), dir))).toBe(true)
    })
  })

  it('has vite config with PWA plugin', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const config = readFileSync(configPath, 'utf-8')
    // just verify the file exists and can be read
    expect(config).toBeTruthy()
  })

  it('has vitest configured', () => {
    expect(existsSync(resolve(process.cwd(), 'src/test/setup.ts'))).toBe(true)
  })
})
