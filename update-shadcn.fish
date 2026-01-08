#!/usr/bin/env fish

set components
for file in src/components/ui/*.tsx
    set components $components (path basename -E $file)
end

bun ui add -y -o $components
