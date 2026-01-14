import { createClient } from '@/lib/supabase/server'
import { ChevronDown } from 'lucide-react'

async function getFAQs() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

    return data || []
}

export default async function FAQPage() {
    const faqs = await getFAQs()

    // Group FAQs by category
    const grouped = faqs.reduce((acc, faq) => {
        const category = faq.category || 'General'
        if (!acc[category]) acc[category] = []
        acc[category].push(faq)
        return acc
    }, {} as Record<string, typeof faqs>)

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-neutral-400">
                        Find answers to common questions about your stay at Villa Mosta.
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 bg-neutral-900">
                <div className="max-w-3xl mx-auto px-6">
                    {Object.entries(grouped).map(([category, categoryFaqs]) => (
                        <div key={category} className="mb-12 last:mb-0">
                            <h2 className="text-lg font-medium text-amber-500 mb-6">{category}</h2>
                            <div className="space-y-4">
                                {(categoryFaqs as typeof faqs).map((faq) => (
                                    <details key={faq.id} className="group">
                                        <summary className="flex items-center justify-between p-6 bg-neutral-950 border border-neutral-800 rounded-xl cursor-pointer list-none hover:border-neutral-700 transition-colors">
                                            <span className="text-white font-medium pr-4">{faq.question}</span>
                                            <ChevronDown size={20} className="text-neutral-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                        </summary>
                                        <div className="p-6 pt-0 bg-neutral-950 border border-t-0 border-neutral-800 rounded-b-xl -mt-3">
                                            <p className="text-neutral-400 leading-relaxed pt-4 border-t border-neutral-800">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}

                    {faqs.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No FAQs available at the moment.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
