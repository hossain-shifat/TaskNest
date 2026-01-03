import React from 'react'
import Banner from './Banner'
import BestWorkers from './BestWorkers'
import Testimonial from './Testimonial'
import HowItWorks from './HowItWorks'
import PlatformStats from './PlatformsStats'
import CallToAction from './CallToAction'
import FAQ from './FAQ'

const Home = () => {
    return (
        <div>
            <Banner />
            <BestWorkers />
            <Testimonial />
            <HowItWorks />
            <CallToAction />
            <PlatformStats />
            <FAQ />
        </div>
    )
}

export default Home
