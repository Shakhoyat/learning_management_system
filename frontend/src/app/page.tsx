"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/features/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      switch (user.role) {
        case "student":
          router.push("/student");
          break;
        case "instructor":
          router.push("/instructor");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/student");
      }
    }
  }, [user, loading, isAuthenticated, router]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "features",
        "about",
        "courses",
        "testimonials",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Navigation with Scroll Spy */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-900/5"
      >
        <div className="w-full max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
              <span className="text-sm font-black text-white tracking-tight">
                EN
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduNova
            </span>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {[
              { id: "hero", label: "Home" },
              { id: "features", label: "Features" },
              { id: "about", label: "About" },
              { id: "courses", label: "Courses" },
              { id: "testimonials", label: "Reviews" },
              { id: "contact", label: "Contact" },
            ].map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08 + 0.4,
                  duration: 0.6,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className={`text-sm font-semibold tracking-wide transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 ${
                  activeSection === item.id
                    ? "text-indigo-600 font-bold"
                    : "text-slate-700 hover:text-indigo-600"
                }`}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          <motion.div
            className="hidden sm:flex items-center space-x-3 lg:space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold tracking-wide hover:bg-slate-100 text-slate-700 px-4 lg:px-6 py-2 h-auto text-sm"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="font-semibold tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/40 border-0 px-4 lg:px-6 py-2 h-auto text-sm"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-20"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 8,
            }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto relative z-10 py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.0,
                duration: 1.0,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <Badge
                variant="secondary"
                className="mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 text-indigo-700 shadow-lg shadow-indigo-100/50"
              >
                <motion.svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mr-2 sm:mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z" />
                </motion.svg>
                The future of learning is here
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6 sm:mb-8 max-w-6xl"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                duration: 1.2,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              Transform Learning with{" "}
              <motion.span
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 1.8,
                  duration: 1.2,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                AI-Powered
              </motion.span>
              <br />
              <span className="font-light">Education Platform</span>
            </motion.h1>

            <motion.p
              className="mt-2 max-w-2xl sm:max-w-3xl lg:max-w-4xl text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light tracking-wide px-4 sm:px-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.4,
                duration: 1.0,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              Create engaging, personalized learning experiences with our
              next-generation LMS. Empower educators, inspire learners, and
              achieve measurable results with intelligent analytics.
            </motion.p>

            <motion.div
              className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.6,
                duration: 1.0,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="h-16 px-10 text-lg font-semibold tracking-wide shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-indigo-500/30"
                  >
                    Start Free Trial
                    <motion.svg
                      className="ml-3 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 6, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path d="M12 4L20 12L12 20L10.59 18.59L16.17 13H4V11H16.17L10.59 5.41L12 4Z" />
                    </motion.svg>
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 text-lg font-semibold tracking-wide border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/60 text-slate-700 hover:text-indigo-700"
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5V7L21 12L8 17V19L23 12L8 5Z" />
                  </svg>
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Key Features Preview */}
            <motion.div
              className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full px-4 sm:px-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.8,
                duration: 1.0,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {[
                {
                  icon: "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z",
                  title: "Advanced Analytics",
                  subtitle: "Real-time Insights",
                  bgColor: "from-blue-500 to-indigo-600",
                  delay: 0.1,
                },
                {
                  icon: "M16 4V2C16 1.45 15.55 1 15 1S14 1.45 14 2V4H10V2C10 1.45 9.55 1 9 1S8 1.45 8 2V4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4H16ZM18 20H6V9H18V20Z",
                  title: "Smart Scheduling",
                  subtitle: "AI-Optimized",
                  bgColor: "from-emerald-500 to-teal-600",
                  delay: 0.15,
                },
                {
                  icon: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L18.16 7.16L9.84 7.16L14.5 2.5L13 1L7 7V9H10V15L8 21H10L12 15L14 21H16L14 15V9H21Z",
                  title: "Global Network",
                  subtitle: "Connect Worldwide",
                  bgColor: "from-purple-500 to-pink-600",
                  delay: 0.2,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 2.0 + feature.delay,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-500"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.bgColor} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-slate-300/50`}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">
                    {feature.subtitle}
                  </p>

                  {/* Hover effect overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.bgColor} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-3xl`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-6 lg:col-start-2 space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
            >
              <div>
                <motion.span
                  className="text-indigo-600 font-bold text-xs sm:text-sm tracking-widest uppercase bg-gradient-to-r from-indigo-50 to-purple-50 px-3 sm:px-4 py-2 rounded-full border border-indigo-200/60"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  What is EduNova LMS?
                </motion.span>
                <motion.h2
                  className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4,
                    duration: 1.0,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  Next-generation learning{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">
                    reimagined
                  </span>
                </motion.h2>
              </div>

              <motion.p
                className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Harness the power of AI and modern technology to create
                personalized learning journeys that adapt to every student's
                unique needs and learning style.
              </motion.p>

              <motion.p
                className="text-base sm:text-lg text-slate-600 font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                From K–12 classrooms to enterprise training, our intelligent
                platform scales with your organization while delivering
                measurable learning outcomes.
              </motion.p>

              <motion.ul
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {[
                  "AI-powered personalized learning paths and adaptive content delivery",
                  "Real-time analytics with predictive insights for student success",
                  "Seamless integration with existing tools and learning ecosystems",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      duration: 0.8,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <motion.div
                      className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                    </motion.div>
                    <span className="text-slate-700 leading-relaxed font-medium text-base sm:text-lg tracking-wide">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      size="lg"
                      className="mt-8 h-14 px-8 text-lg font-semibold tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/60 border-0"
                    >
                      Explore Features
                      <motion.svg
                        className="ml-3 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path d="M12 4L20 12L12 20L10.59 18.59L16.17 13H4V11H16.17L10.59 5.41L12 4Z" />
                      </motion.svg>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Image/Demo */}
            <motion.div
              className="lg:col-span-4 relative"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 1.0,
                delay: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <motion.div
                className="relative bg-gradient-to-br from-slate-50 to-indigo-50/60 rounded-3xl p-10 shadow-2xl shadow-slate-300/25 border border-slate-200/60 backdrop-blur-sm"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
              >
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-xl"
                  animate={{
                    rotate: [0, 15, 0],
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl"
                  animate={{
                    rotate: [0, -20, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl"
                  animate={{
                    rotate: [0, -20, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />

                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100/80 backdrop-blur-sm">
                  <motion.div
                    className="flex items-center space-x-3 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                    <span className="ml-6 text-sm text-slate-500 font-semibold tracking-wide">
                      EduNova Dashboard
                    </span>
                  </motion.div>

                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                  >
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full w-4/5"></div>
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full w-3/5"></div>

                    <div className="grid grid-cols-3 gap-6 mt-10">
                      {[
                        {
                          color: "from-indigo-500 to-purple-600",
                          icon: "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z",
                        },
                        {
                          color: "from-emerald-500 to-teal-600",
                          icon: "M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z",
                        },
                        {
                          color: "from-rose-500 to-pink-600",
                          icon: "M16 4V2C16 1.45 15.55 1 15 1S14 1.45 14 2V4H10V2C10 1.45 9.55 1 9 1S8 1.45 8 2V4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4H16ZM18 20H6V9H18V20Z",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className={`h-28 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d={item.icon} />
                          </svg>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About EduNova Section */}
      <section
        id="about"
        className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Teach smarter,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                learn better
              </span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Experience the next evolution of educational technology with
              AI-driven insights, personalized learning paths, and seamless
              collaboration tools that make learning enjoyable and effective.
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z",
                title: "Mobile-First Learning",
                description:
                  "Learn anywhere, anytime with our responsive design and offline capabilities. Native mobile apps ensure seamless learning on the go.",
                gradient: "from-blue-500 to-cyan-600",
                delay: 0.1,
              },
              {
                icon: "M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 14C11.3 14 18 15.7 18 19V22H2V19C2 15.7 4.7 14 8 14ZM16 14C16.4 14 16.9 14 17.4 14.1C18.8 15.2 20 16.5 20 19V22H18V19C18 17.4 17.6 15.9 16 14Z",
                title: "Smart Collaboration",
                description:
                  "AI-powered group formation, real-time collaboration tools, and intelligent discussion forums that adapt to learning styles.",
                gradient: "from-emerald-500 to-teal-600",
                delay: 0.2,
              },
              {
                icon: "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z",
                title: "Predictive Analytics",
                description:
                  "Advanced AI algorithms predict learning outcomes, identify at-risk students, and recommend personalized intervention strategies.",
                gradient: "from-purple-500 to-pink-600",
                delay: 0.3,
              },
              {
                icon: "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z",
                title: "Real-Time Insights",
                description:
                  "Live dashboards with actionable insights, engagement metrics, and performance analytics for data-driven decision making.",
                gradient: "from-orange-500 to-red-600",
                delay: 0.4,
              },
              {
                icon: "M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H7.17L9.17 6H14.83L16.83 8H20V19ZM12 17C14.76 17 17 14.76 17 12S14.76 7 12 7 7 9.24 7 12 9.24 17 12 17ZM12 9C13.65 9 15 10.35 15 12S13.65 15 12 15 9 13.65 9 12 10.35 9 12 9Z",
                title: "Interactive Content",
                description:
                  "Rich multimedia content, virtual labs, AR/VR experiences, and interactive simulations that bring learning to life.",
                gradient: "from-violet-500 to-purple-600",
                delay: 0.5,
              },
              {
                icon: "M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12",
                title: "Blockchain Certificates",
                description:
                  "Secure, verifiable digital credentials and certificates powered by blockchain technology for authentic skill verification.",
                gradient: "from-rose-500 to-pink-600",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={feature.icon} />
                      </svg>
                    </motion.div>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>

                  {/* Hover effect overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              {
                number: "10M+",
                label: "Active Learners",
                gradient: "from-blue-600 to-cyan-600",
              },
              {
                number: "50K+",
                label: "Courses Created",
                gradient: "from-emerald-600 to-teal-600",
              },
              {
                number: "99.9%",
                label: "Uptime Guarantee",
                gradient: "from-purple-600 to-pink-600",
              },
              {
                number: "150+",
                label: "Countries",
                gradient: "from-orange-600 to-red-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.7 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Course Categories */}
      <section
        id="courses"
        className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Tailored solutions for{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                every learner
              </span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Discover how our AI-powered learning platform adapts to different
              educational contexts and learner needs across various industries
              and institutions.
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "K-12 Education",
                subtitle: "Elementary to High School",
                description:
                  "Create engaging, age-appropriate learning experiences with gamification, parental dashboards, and safety-first design.",
                gradient: "from-blue-500 to-indigo-600",
                icon: "M5 13.18V4H19V13.18L12 20L5 13.18ZM12 2L22 12L12 22L2 12L12 2ZM15 6H9V7H15V6ZM15 8H9V9H15V8ZM15 10H9V11H15V10Z",
                features: [
                  "Safe learning environment",
                  "Gamified experiences",
                  "Parent-teacher communication",
                ],
                delay: 0.1,
              },
              {
                title: "Higher Education",
                subtitle: "Colleges & Universities",
                description:
                  "Comprehensive platform for academic institutions with advanced research tools, thesis management, and academic integrity features.",
                gradient: "from-emerald-500 to-teal-600",
                icon: "M6 2H18V7H18.5C19.9 7 21 8.1 21 9.5V12.5C21 13.9 19.9 15 18.5 15H18V22H6V15H5.5C4.1 15 3 13.9 3 12.5V9.5C3 8.1 4.1 7 5.5 7H6V2ZM8 4V7H16V4H8ZM8 20H16V17H8V20ZM5.5 9C5.2 9 5 9.2 5 9.5V12.5C5 12.8 5.2 13 5.5 13H6V9H5.5ZM18 9V13H18.5C18.8 13 19 12.8 19 12.5V9.5C19 9.2 18.8 9 18.5 9H18Z",
                features: [
                  "Research collaboration",
                  "Thesis management",
                  "Academic integrity",
                ],
                delay: 0.2,
              },
              {
                title: "Corporate Training",
                subtitle: "Professional Development",
                description:
                  "Enterprise-grade learning solutions with compliance tracking, skill assessments, and ROI analytics for workforce development.",
                gradient: "from-purple-500 to-pink-600",
                icon: "M14 6V4H5V6H14ZM4 8V9C4 10.1 4.9 11 6 11H9L12 8H20V6C20 4.9 19.1 4 18 4H16V6H4V8ZM6 12V20C6 21.1 6.9 22 8 22H20C21.1 22 22 21.1 22 20V12C22 10.9 21.1 10 20 10H8C6.9 10 6 10.9 6 12Z",
                features: [
                  "Compliance tracking",
                  "Skill assessments",
                  "ROI analytics",
                ],
                delay: 0.3,
              },
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: course.delay, duration: 0.6 }}
                className="group"
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full">
                  <motion.div
                    className={`relative h-56 bg-gradient-to-br ${course.gradient} p-8 text-white overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Floating background elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-xl"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, -10, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="w-12 h-12 bg-white/20 rounded-xl mb-4 flex items-center justify-center backdrop-blur-sm"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={course.icon} />
                        </svg>
                      </motion.div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-2xl font-bold mb-2">
                          {course.title}
                        </h3>
                        <p className="text-white/80 text-sm font-medium">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <CardContent className="p-8">
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {course.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: course.delay + 0.3 + featureIndex * 0.1,
                          }}
                        >
                          <div
                            className={`w-2 h-2 bg-gradient-to-r ${course.gradient} rounded-full`}
                          />
                          <span className="text-sm text-slate-600">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`text-transparent bg-gradient-to-r ${course.gradient} bg-clip-text hover:bg-slate-50 p-0 font-semibold group-hover:translate-x-1 transition-transform duration-300`}
                      >
                        Explore Solutions
                        <motion.svg
                          className="ml-2 w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path d="M12 4L20 12L12 20L10.59 18.59L16.17 13H4V11H16.17L10.59 5.41L12 4Z" />
                        </motion.svg>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expand Functionality Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </motion.div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 bg-white/10 text-white border-white/20 backdrop-blur-sm"
              >
                <svg
                  className="mr-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z" />
                </svg>
                Seamless Integrations
              </Badge>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Connect with your favorite tools and unlock endless possibilities
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Seamlessly integrate with 500+ tools including Google Workspace,
              Microsoft 365, Zoom, Slack, and more. Build a unified learning
              ecosystem that works for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-lg shadow-2xl bg-white text-indigo-600 hover:bg-white/90 border-0 font-semibold"
                >
                  Explore Integrations
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4L20 12L12 20L10.59 18.59L16.17 13H4V11H16.17L10.59 5.41L12 4Z" />
                  </svg>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 sm:py-24 md:py-28 lg:py-32 bg-slate-50"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Loved by educators{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                worldwide
              </span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of educators and learners who have transformed
              their teaching and learning experience with EduNova.
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Professor of Computer Science, MIT",
                content:
                  "EduNova's AI-powered insights have revolutionized how I understand my students' learning patterns. The personalized recommendations are incredibly accurate.",
                avatar: "SC",
                bgColor: "from-blue-500 to-indigo-600",
                rating: 5,
                delay: 0.1,
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Training, Google",
                content:
                  "We've seen a 400% increase in course completion rates since implementing EduNova. The analytics dashboard provides actionable insights that drive real results.",
                avatar: "MR",
                bgColor: "from-emerald-500 to-teal-600",
                rating: 5,
                delay: 0.2,
              },
              {
                name: "Emma Thompson",
                role: "K-12 Principal, London Academy",
                content:
                  "The platform's safety features and parental engagement tools have made remote learning not just possible, but genuinely effective for our young learners.",
                avatar: "ET",
                bgColor: "from-purple-500 to-pink-600",
                rating: 5,
                delay: 0.3,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: testimonial.delay, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: testimonial.delay + 0.2 }}
                    >
                      <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: testimonial.delay + 0.3 + i * 0.1,
                              type: "spring",
                            }}
                          >
                            ⭐
                          </motion.span>
                        ))}
                      </div>
                      <p className="text-slate-700 italic leading-relaxed text-lg">
                        "{testimonial.content}"
                      </p>
                    </motion.div>

                    <motion.div
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: testimonial.delay + 0.4 }}
                    >
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-slate-900 text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to transform{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                education?
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of educators and learners who are already using
              EduNova to create personalized, engaging, and effective learning
              experiences.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-indigo-500/25"
                  >
                    Start Your Free Trial
                    <motion.svg
                      className="ml-2 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path d="M12 4L20 12L12 20L10.59 18.59L16.17 13H4V11H16.17L10.59 5.41L12 4Z" />
                    </motion.svg>
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700"
                >
                  <svg
                    className="mr-2 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5V7L21 12L8 17V19L23 12L8 5Z" />
                  </svg>
                  Schedule a Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {[
                {
                  icon: "M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z",
                  title: "Email Us",
                  subtitle: "hello@edunova.com",
                  gradient: "from-blue-500 to-indigo-600",
                  delay: 0.1,
                },
                {
                  icon: "M12 3C17.5 3 22 6.6 22 11C22 15.4 17.5 19 12 19C10.3 19 8.7 18.6 7.3 17.8L3 19L4.2 16.7C3.4 15.3 3 13.7 3 12C3 7.6 7.5 4 13 4H12ZM8.5 12.5C8.5 13.3 9.2 14 10 14S11.5 13.3 11.5 12.5 10.8 11 10 11 8.5 11.7 8.5 12.5ZM15.5 12.5C15.5 13.3 14.8 14 14 14S12.5 13.3 12.5 12.5 13.2 11 14 11 15.5 11.7 15.5 12.5Z",
                  title: "Live Chat",
                  subtitle: "Available 24/7",
                  gradient: "from-emerald-500 to-teal-600",
                  delay: 0.2,
                },
                {
                  icon: "M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z",
                  title: "Call Us",
                  subtitle: "+1 (555) 123-4567",
                  gradient: "from-purple-500 to-pink-600",
                  delay: 0.3,
                },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + contact.delay }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-r ${contact.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={contact.icon} />
                    </svg>
                  </motion.div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg group-hover:text-indigo-600 transition-colors duration-300">
                    {contact.title}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {contact.subtitle}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-14 md:py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="col-span-1 md:col-span-2">
              <motion.div
                className="flex items-center space-x-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-sm font-bold text-white">EN</span>
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  EduNova
                </span>
              </motion.div>

              <motion.p
                className="text-slate-400 mb-6 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Empowering educators and learners worldwide with AI-driven,
                personalized learning experiences that adapt to individual needs
                and unlock human potential.
              </motion.p>

              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {[
                  {
                    platform: "Twitter",
                    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                  },
                  {
                    platform: "LinkedIn",
                    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                  {
                    platform: "GitHub",
                    icon: "M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={social.platform}
                    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-all duration-300 group"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <svg
                      className="w-5 h-5 fill-slate-400 group-hover:fill-white transition-colors duration-300"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {[
              {
                title: "Product",
                links: [
                  "Features",
                  "Pricing",
                  "Integrations",
                  "Security",
                  "API",
                ],
              },
              {
                title: "Support",
                links: [
                  "Documentation",
                  "Help Center",
                  "Community",
                  "Contact",
                  "Status",
                ],
              },
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + sectionIndex * 0.1 }}
              >
                <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3 text-slate-400">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05,
                      }}
                    >
                      <motion.a
                        href="#"
                        className="hover:text-white transition-colors duration-300 cursor-pointer"
                        whileHover={{ x: 3 }}
                      >
                        {link}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-slate-400 text-sm">
              © 2025 EduNova. All rights reserved. Built with ❤️ for educators
              worldwide.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link, index) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -1 }}
                  >
                    {link}
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
