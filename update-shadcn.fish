#!/usr/bin/env fish

for file in src/components/ui/*.tsx
    bun ui add -y -o (path basename -E $file)
end
