#!/usr/bin/env fish

set components
for file in src/components/ui/*.tsx
    set components $components (path basename -E $file)
end

bunx --bun shadcn@latest add -y -o $components
