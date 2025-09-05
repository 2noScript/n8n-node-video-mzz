# Run basic test
bun test tests/cut-basic.test.ts

# Run test in range mode
bun test tests/cut-range.test.ts

# Run test in duration mode
bun test tests/cut-duration.test.ts

# Run test in keep mode
bun test tests/cut-keep.test.ts

# Run test in remove mode
bun test tests/cut-remove.test.ts

# Run test in interval mode
bun test tests/cut-interval.test.ts

# Run test in count mode
bun test tests/cut-count.test.ts

# Run edge case tests
bun test tests/cut-edge-cases.test.ts

# Run all cut tests
bun test tests/cut-*.test.ts
