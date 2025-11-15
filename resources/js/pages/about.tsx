import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Leaf, ShoppingBag, Sparkles, Star, Users } from 'lucide-react';

export default function About() {
    return (
        <>
            <Head title="À propos de Bsissa - Notre Histoire">
                <meta
                    name="description"
                    content="Découvrez l'histoire de Bsissa, notre passion pour les saveurs authentiques tunisiennes et notre engagement envers la qualité et la tradition."
                />
            </Head>
            <PublicLayout>
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
                    {/* Hero Section */}
                    <section className="relative isolate">
                        <div className="absolute inset-0 -z-10">
                            <img
                                src="/storage/about/bsissa-tradition.jpg"
                                alt="Artisan préparant la Bsissa traditionnelle"
                                className="h-full w-full object-cover opacity-20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-emerald-950/40 to-white" />
                        </div>

                        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 ring-1 ring-amber-200">
                                    <Sparkles className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-amber-900">3000 ans de tradition</span>
                                </div>

                                <h1
                                    className="mt-6 text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl lg:text-6xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    L'Art de la Bsissa,
                                    <br />
                                    <span className="text-amber-700">Sublimé par la Passion</span>
                                </h1>

                                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-emerald-800/80">
                                    Depuis notre atelier au cœur de la Tunisie, nous perpétuons un savoir-faire ancestral transmis de génération en génération. Chaque mélange
                                    raconte une histoire, chaque grain célèbre le terroir.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Notre Histoire */}
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 ring-1 ring-emerald-200">
                                    <Heart className="h-4 w-4 text-emerald-700" />
                                    <span className="text-sm font-semibold text-emerald-900">Notre Histoire</span>
                                </div>

                                <h2
                                    className="text-3xl font-bold text-emerald-900 sm:text-4xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Une Passion Familiale Devenue Mission
                                </h2>

                                <div className="prose prose-emerald prose-lg max-w-none">
                                    <p className="text-emerald-800/80 leading-relaxed">
                                        Tout a commencé dans la cuisine de ma grand-mère, où les parfums d'épices grillées et de graines torréfiées embaumaient les
                                        matins. J'ai grandi bercé par le crépitement des amandes dans la poêle, le geste précis du pilon dans le mortier, et cette alchimie
                                        unique qui transforme des ingrédients simples en un trésor nutritionnel.
                                    </p>

                                    <p className="text-emerald-800/80 leading-relaxed">
                                        <strong className="text-emerald-900">En 2020</strong>, face à l'uniformisation de nos habitudes alimentaires, j'ai décidé de
                                        redonner ses lettres de noblesse à la Bsissa. Non pas comme un simple produit, mais comme une <em>expérience sensorielle</em>, un{' '}
                                        <em>voyage gustatif</em>, un <em>pont entre tradition et modernité</em>.
                                    </p>

                                    <p className="text-emerald-800/80 leading-relaxed">
                                        Aujourd'hui, notre atelier emploie une dizaine d'artisans passionnés. Nous torréfions, moulons et assemblons chaque lot avec la même
                                        exigence : celle de créer des mélanges qui nourrissent le corps, éveillent les papilles et honorent notre patrimoine.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/20">
                                    <img
                                        src="/storage/about/artisan-workshop.jpg"
                                        alt="Atelier artisanal de préparation de Bsissa"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 rounded-2xl bg-amber-500 px-8 py-6 shadow-xl shadow-amber-500/30">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-white">+50K</div>
                                        <div className="mt-1 text-sm font-semibold text-amber-950">Clients satisfaits</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Nos Valeurs */}
                    <section className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 py-20 text-white">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold sm:text-4xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Les Valeurs qui Nous Animent
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-emerald-100/80">
                                    Quatre piliers fondamentaux guident chacune de nos décisions, de la sélection des ingrédients à la livraison chez vous.
                                </p>
                            </div>

                            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        icon: Leaf,
                                        title: 'Authenticité',
                                        description: 'Recettes ancestrales respectées, méthodes artisanales préservées, aucun compromis sur la tradition.',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Qualité Premium',
                                        description: 'Sélection rigoureuse des matières premières, contrôles qualité stricts, traçabilité totale.',
                                    },
                                    {
                                        icon: Heart,
                                        title: 'Passion',
                                        description: 'Amour du métier, respect des producteurs locaux, engagement envers nos clients fidèles.',
                                    },
                                    {
                                        icon: Users,
                                        title: 'Communauté',
                                        description: 'Soutien aux agriculteurs tunisiens, partage de recettes, création de liens authentiques.',
                                    },
                                ].map((value) => (
                                    <div key={value.title} className="rounded-3xl bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
                                            <value.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-white">{value.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-emerald-100/75">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Notre Processus */}
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2
                                className="text-3xl font-bold text-emerald-900 sm:text-4xl"
                                style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                            >
                                De la Graine à Votre Bol
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-emerald-800/80">
                                Un processus méticuleux en cinq étapes pour garantir une Bsissa exceptionnelle.
                            </p>
                        </div>

                        <div className="mt-16 space-y-12">
                            {[
                                {
                                    step: '01',
                                    title: 'Sélection des Ingrédients',
                                    description:
                                        'Nous travaillons directement avec des agriculteurs tunisiens pour sélectionner les meilleures graines : orge, pois chiches, coriandre, fenouil, anis. Chaque lot est inspecté et testé avant validation.',
                                    image: '/storage/about/selection-ingredients.jpg',
                                },
                                {
                                    step: '02',
                                    title: 'Torréfaction Artisanale',
                                    description:
                                        'La torréfaction est un art. Nous contrôlons précisément la température et le temps pour révéler les arômes sans brûler les nutriments. Cette étape cruciale détermine la personnalité de chaque mélange.',
                                    image: '/storage/about/torrefaction.jpg',
                                },
                                {
                                    step: '03',
                                    title: 'Mouture Traditionnelle',
                                    description:
                                        'Nos moulins à meules de pierre préservent les huiles essentielles et les saveurs intactes. La granulométrie est ajustée selon les recettes ancestrales pour obtenir la texture idéale.',
                                    image: '/storage/about/mouture.jpg',
                                },
                                {
                                    step: '04',
                                    title: 'Assemblage & Contrôle',
                                    description:
                                        'Chaque mélange est assemblé selon des proportions millénaires, puis contrôlé organoleptiquement. Nos experts vérifient couleur, odeur, texture et goût avant validation.',
                                    image: '/storage/about/assemblage.jpg',
                                },
                                {
                                    step: '05',
                                    title: 'Emballage & Livraison',
                                    description:
                                        'Conditionnement hermétique pour préserver fraîcheur et arômes. Expédition rapide dans toute la Tunisie pour que vous receviez votre Bsissa au summum de sa qualité.',
                                    image: '/storage/about/emballage.jpg',
                                },
                            ].map((process, index) => (
                                <div
                                    key={process.step}
                                    className={`grid gap-8 lg:grid-cols-2 lg:gap-16 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                                >
                                    <div className={`space-y-4 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                        <div className="inline-flex items-center gap-3">
                                            <span className="text-6xl font-black text-emerald-200">{process.step}</span>
                                            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-emerald-900">{process.title}</h3>
                                        <p className="text-emerald-800/80 leading-relaxed">{process.description}</p>
                                    </div>
                                    <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                                        <div className="aspect-[16/10] overflow-hidden rounded-3xl shadow-xl shadow-emerald-900/20">
                                            <img src={process.image} alt={process.title} className="h-full w-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Témoignages */}
                    <section className="bg-amber-50 py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold text-emerald-900 sm:text-4xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Ils Partagent Leur Expérience
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-emerald-800/80">
                                    Découvrez ce que nos clients disent de leur voyage gustatif avec Bsissa.
                                </p>
                            </div>

                            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        name: 'Amira Ben Salem',
                                        role: 'Nutritionniste',
                                        quote: "J'ai redécouvert la Bsissa grâce à vous. La qualité est incomparable, et mes patients adorent ! C'est devenu mon petit-déjeuner quotidien.",
                                        avatar: '/storage/testimonials/amira.jpg',
                                    },
                                    {
                                        name: 'Karim Trabelsi',
                                        role: 'Chef pâtissier',
                                        quote: "J'utilise vos mélanges dans mes créations. Les saveurs sont puissantes, authentiques, et apportent une vraie signature tunisienne à mes desserts.",
                                        avatar: '/storage/testimonials/karim.jpg',
                                    },
                                    {
                                        name: 'Leila Hamdi',
                                        role: 'Maman de 3 enfants',
                                        quote: "Mes enfants adorent leur bol de Bsissa le matin ! C'est sain, gourmand, et je sais exactement ce qu'ils mangent. Merci pour ce produit exceptionnel.",
                                        avatar: '/storage/testimonials/leila.jpg',
                                    },
                                ].map((testimonial) => (
                                    <div key={testimonial.name} className="rounded-3xl bg-white p-8 shadow-lg shadow-emerald-900/10">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                                            ))}
                                        </div>
                                        <p className="mt-4 text-emerald-800/80 leading-relaxed italic">"{testimonial.quote}"</p>
                                        <div className="mt-6 flex items-center gap-4">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold text-emerald-900">{testimonial.name}</div>
                                                <div className="text-sm text-emerald-700/60">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-8 py-16 text-center text-white shadow-2xl shadow-emerald-900/40 sm:px-16 sm:py-20">
                            <div className="absolute inset-0 opacity-10">
                                <img src="/storage/patterns/grain-pattern.png" alt="" className="h-full w-full object-cover" />
                            </div>

                            <div className="relative">
                                <h2
                                    className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Prêt à Découvrir Nos Trésors ?
                                </h2>
                                <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/80">
                                    Explorez notre collection de mélanges artisanaux et commencez votre voyage gustatif dès aujourd'hui.
                                </p>

                                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link href="/">
                                        <Button className="inline-flex h-14 items-center gap-2 rounded-full bg-amber-500 px-8 text-base font-semibold text-emerald-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400">
                                            <ShoppingBag className="h-5 w-5" />
                                            Découvrir nos produits
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/recipes">
                                        <Button
                                            variant="outline"
                                            className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
                                        >
                                            Voir nos recettes
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
}
