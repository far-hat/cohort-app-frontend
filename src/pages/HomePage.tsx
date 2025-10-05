import cohortHero from "../assets/cohortHero.png"
const HomePage = () => {
    return(
        <div className="flex flex-col gap-12">
            <div className="md:px-32 bg-gray rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
                <h1 className="text-5xl font-bold tracking-tight text-cream-500">
                    Learn together. Compete together. Grow together
                </h1>
                <span className="text-xl">Assess. Compete. Excel.</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
                <img src= {cohortHero}  />
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <span className="font-bold text-3xl tracking tighter">From learners to leaders — one quiz away</span>
                </div>

            </div>
        </div>
    )
}

export default HomePage;