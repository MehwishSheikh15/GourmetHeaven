import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Award, Clock, Users, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Years of Excellence', value: '25+', icon: <Award className="w-6 h-6" /> },
    { label: 'Master Chefs', value: '12', icon: <Utensils className="w-6 h-6" /> },
    { label: 'Daily Guests', value: '500+', icon: <Users className="w-6 h-6" /> },
    { label: 'Commitment', value: '100%', icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  const milestones = [
    {
      year: '1998',
      title: 'The Royal Awakening',
      description: 'Gourmet Haven opened its gilded doors with a simple mission: to redefine the art of dining through passion and precision.'
    },
    {
      year: '2005',
      title: 'First Michelin Star',
      description: 'Our commitment to culinary excellence was recognized globally, setting a new standard for luxury dining in the heart of the city.'
    },
    {
      year: '2015',
      title: 'Global Expansion',
      description: 'Bringing our heritage of flavors to new horizons, blending local inspirations with our signature royal touch.'
    },
    {
      year: '2023',
      title: 'Digital Evolution',
      description: 'Embracing the future with seamless online experiences while maintaining our timeless tradition of hospitality.'
    }
  ];

  return (
    <div className="bg-[#F8F7F3] min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80" 
            alt="About Gourmet Haven"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] uppercase tracking-[0.4em] text-sm font-bold mb-4 block"
          >
            Since 1998
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6"
          >
            A Heritage of Taste
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Where culinary mastery meets royal tradition. Every dish tells a story of passion, 
            crafted with the finest ingredients and a touch of elegance.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block p-3 bg-stone-100 rounded-2xl">
              <Heart className="text-[#C5A059] w-8 h-8" />
            </div>
            <h2 className="text-4xl font-serif text-stone-800 leading-tight">
              Our Culinary <br />
              <span className="text-[#C5A059]">Philosophy</span>
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              At Gourmet Haven, we believe that dining is not just about sustenance; it's an immersive 
              experience that engages all senses. We source our ingredients from artisanal producers 
              who share our respect for the earth and the seasons.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Our chefs are orchestrators of flavor, balancing traditional techniques with modern 
              innovation to create masterpieces that are as beautiful to behold as they are exquisite 
              to taste.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[#C5A059] mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-stone-800">{stat.value}</div>
                  <div className="text-sm uppercase tracking-wider text-stone-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1550966842-20dc207baec7?auto=format&fit=crop&q=80" 
              alt="Chef at work"
              className="rounded-[3rem] shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#C5A059]/10 rounded-[3rem] -z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-stone-900 py-24 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-white mb-4">Our Journey Through Time</h2>
            <div className="w-24 h-1 bg-[#C5A059] mx-auto opacity-50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group"
              >
                <div className="text-3xl font-serif text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">{item.year}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto px-4 text-center pb-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-serif text-stone-800">The Gourmet Promise</h2>
          <p className="text-stone-600 text-xl italic font-serif leading-relaxed">
            "To invite the world to a royal table, where every guest is treated as a sovereign, 
            and every meal is a celebration of life's finest moments."
          </p>
          <div className="pt-8">
            <p className="font-serif text-stone-800 text-lg">Executive Chef & Founder</p>
            <p className="text-[#C5A059] font-bold uppercase tracking-widest text-sm">Mehwish Sheikh</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
