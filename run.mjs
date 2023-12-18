const { main } = await import(`./day-${process.argv[2]}/puzzle-${process.argv[3] ?? '1'}.mjs`)
console.log(await main())
