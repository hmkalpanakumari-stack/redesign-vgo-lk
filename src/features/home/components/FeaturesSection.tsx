import { features } from '@/data/content'

export function FeaturesSection() {
  return (
    <section className="py-12 bg-primary-blue text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map(feature => (
            <div key={feature.id} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
