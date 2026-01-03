import React from 'react'
import Banner from './Banner'
import BestWorkers from './BestWorkers'
import Testimonial from './Testimonial'
import HowItWorks from './HowItWorks'
import PlatformStats from './PlatformsStats'

const Home = () => {
    return (
        <div>
            <Banner />
            <BestWorkers />
            <Testimonial />
            <HowItWorks/>
            <PlatformStats/>
        </div>
    )
}

export default Home
