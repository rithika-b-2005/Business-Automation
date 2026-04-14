"use client"

import { motion } from "framer-motion"
import Banner from "@/app/components/Banner"
import Client from "@/app/components/Client"
import Header from "@/app/components/Header"
import AboutSection from "@/app/components/AboutSection"
import WhatWeDo from "@/app/components/WhatWeDo"
import HowItWorks from "@/app/components/HowItWorks"
import FAQ from "@/app/components/FAQ"
import Testimonials from "@/app/components/Testimonials"
import CTABanner from "@/app/components/CTABanner"
import Careers from "@/app/components/Careers"
import FloatingMenu from "@/app/components/FloatingMenu"

export default function Home() {
  return (
    <>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />
      <Banner />
      <AboutSection />
      <Client />
      <WhatWeDo />
      <HowItWorks />
      <Careers />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <FloatingMenu />
    </motion.div>
    </>
  )
}
