import React from "react";
import premium from "../../assets/image/premium.svg";
import happyface from "../../assets/image/happyface.svg";
import footstep from "../../assets/image/footstep.svg";
import trust from "../../assets/image/trust.svg";

const AboutUs = () => {
  const story =
    "https://images.unsplash.com/photo-1528701800489-20be9c2d3b6a?auto=format&fit=crop&q=80&w=1600";
  const mission =
    "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&q=80&w=300";
  const vision =
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300";

  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      name: "Jane Smith",
      role: "Marketing Head",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      name: "Sam Wilson",
      role: "Design Lead",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    },
    {
      name: "Lucy Heart",
      role: "Quality Specialist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers", icon: "groups" },
    { value: "500+", label: "Store Outlets", icon: "storefront" },
    { value: "150+", label: "Brand Partners", icon: "handshake" },
    { value: "24/7", label: "Customer Support", icon: "support_agent" },
  ];

  return (
    <div className="flex flex-col w-full bg-white gap-16 md:gap-24 overflow-x-hidden font-poppins">
      
      {/* Hero Banner */}
      <section className="relative w-full min-h-[450px] flex items-center bg-card-beige/50 px-8 md:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card-beige via-white to-accent-yellow/20 opacity-90" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top,#ff6d2e33,transparent_55%)]" />
        <div className="relative z-10 max-w-2xl animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-black leading-tight uppercase">
            WE ARE <span className="text-primary italic">SOLE VORA</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 font-medium leading-relaxed italic">
            More than just a store — we are a movement. Redefining how the world steps, 
            one pair of high-performance kicks at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="flex flex-col md:flex-row items-center gap-12 px-8 md:px-20 py-16 bg-accent-yellow/10">
        <div className="flex-1 max-w-xl group">
          <img src={story} alt="Our Story" className="w-full rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 ring-8 ring-white" />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-4xl font-black uppercase tracking-tight">The SoleVora Legacy</h2>
          <p className="text-gray-600 leading-relaxed italic">
            Founded with a passion for craftsmanship, SoleVora began in a small workshop with a single goal: 
            to create footwear that doesn't just look premium but feels revolutionary. 
            We believe every step should tell a story of confidence and quality.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, we are proud to serve a global community of sneakerheads, athletes, and style icons who 
            refuse to compromise on their pace.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 md:px-20 py-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-black/5 flex flex-col gap-6 hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4">
             <img src={mission} alt="Mission" className="w-12 h-12 object-contain" />
             <h3 className="text-4xl font-black uppercase tracking-tighter">Mission</h3>
          </div>
          <p className="text-gray-600 italic font-medium">To empower individuals through footwear that blends innovative technology with timeless aesthetics, ensuring every customer feels legendary.</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-black/5 flex flex-col gap-6 hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4">
             <img src={vision} alt="Vision" className="w-12 h-12 object-contain" />
             <h3 className="text-4xl font-black uppercase tracking-tighter">Vision</h3>
          </div>
          <p className="text-gray-600 italic font-medium">To become the world's most trusted footwear destination, recognized for our commitment to sustainable quality and radical design.</p>
        </div>
      </section>

      {/* Why We Are Different */}
      <section className="py-24 px-8 md:px-20 bg-accent-yellow/30 text-center flex flex-col items-center gap-16">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tight mb-4">Why Step With Us?</h2>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">The SoleVora Advantage</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl">
           {[
             { icon: trust, title: "Pure Trust", desc: "100% authentic products sourced directly from manufacturers." },
             { icon: happyface, title: "Happy Pace", desc: "Ergonomic designs focused on long-term foot health." },
             { icon: premium, title: "Elite Material", desc: "We use only top-tier leathers and sustainable synthetics." },
             { icon: footstep, title: "Quality Steps", desc: "Every pair undergoes a rigorous 50-point inspection." }
           ].map((feat, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-black/5 group hover:bg-black hover:text-white transition-all duration-500">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary transition-colors">
                   <img src={feat.icon} alt={feat.title} className="w-8 h-8 object-contain" />
                </div>
                <h5 className="text-lg font-black uppercase mb-3 transition-colors">{feat.title}</h5>
                <p className="text-xs font-medium opacity-70 italic">{feat.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-8 md:px-20 py-20 bg-secondary">
        {stats.map((stat, idx) => (
           <div key={idx} className="flex flex-col items-center text-center gap-4 group">
              <span className="material-symbols-outlined text-primary text-5xl group-hover:scale-125 transition-transform">{stat.icon}</span>
              <div className="flex flex-col">
                 <h4 className="text-4xl font-black text-white">{stat.value}</h4>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
           </div>
        ))}
      </section>

      {/* Customer Wall */}
      <section className="py-24 px-8 md:px-20 bg-accent-yellow/10 text-center flex flex-col items-center gap-16">
         <h2 className="text-4xl font-black uppercase tracking-tight">Wall of Love</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
           {[
             { name: "Alexander K.", date: "Jan 2024", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander", comment: "The quality of the leather is incomparable. I've never felt more stylish and comfortable." },
             { name: "Sierra M.", date: "Mar 2024", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sierra", comment: "SoleVora changed my morning run game. The shock absorption is pure magic." },
             { name: "Marcus T.", date: "Feb 2024", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", comment: "Found my signature look here. The attention to detail in the stitching is insane." }
           ].map((review, i) => (
             <div key={i} className="bg-white p-10 rounded-[2rem] shadow-md hover:shadow-2xl transition-all text-left flex flex-col gap-6 relative">
                <div className="text-primary text-3xl font-black select-none">{"★".repeat(5)}</div>
                <p className="text-sm italic text-gray-600 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                   <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                   <div className="flex flex-col">
                      <span className="text-xs font-black uppercase">{review.name}</span>
                      <span className="text-[9px] font-bold text-gray-400">{review.date}</span>
                   </div>
                </div>
             </div>
           ))}
         </div>
      </section>

      {/* Meet Team */}
      <section className="py-24 px-8 md:px-20 bg-gradient-to-b from-white to-card-beige/60 animate-fadeIn text-center flex flex-col items-center gap-16">
        <h2 className="text-5xl font-black uppercase tracking-tight">Meet the <span className="text-primary italic">Minds</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-5xl">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-4 transition-all duration-500 group">
               <div className="h-64 overflow-hidden bg-slate-50">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               </div>
               <div className="p-8">
                  <h3 className="text-sm font-black uppercase truncate tracking-tight">{member.name}</h3>
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 italic">{member.role}</h4>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutUs;