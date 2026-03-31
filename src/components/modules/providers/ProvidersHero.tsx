export function ProvidersHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Amazing Providers
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse through our curated selection of verified food providers
            offering delicious meals
          </p>
        </div>
      </div>
    </section>
  );
}
