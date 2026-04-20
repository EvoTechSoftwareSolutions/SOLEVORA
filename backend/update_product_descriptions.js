
import sequelize from './config/db.js';
import Product from './models/Product.js';

const descriptions = {
    1: "Experience the pinnacle of daily performance with the SoleRunner V1. Engineered with our proprietary cloud-foam cushioning and an aerodynamic mesh upper, it provides unparalleled comfort and breathability for your morning miles or afternoon strolls.",
    2: "Navigate the city streets with effortless grace in the Urban Glide. Combining a sleek, minimalist aesthetic with high-traction outsoles, these shoes are designed for the modern commuter who refuses to compromise on style or stability.",
    3: "Dominate the paint and elevate your game with the Hoop Master 3000. Built for explosive athletes, it features a carbon-fiber spring plate and reinforced ankle support to ensure maximum vertical leap and rock-solid lateral stability.",
    4: "Break your personal records with the Speed Demon, our lightest racing shoe yet. Every gram is optimized for velocity, featuring a precision-tuned midsole that returns 90% of your energy with every stride, pushing you toward the finish line faster than ever.",
    5: "Designed for the relentless explorer, the City Walker blends rugged durability with sophisticated design. Whether you're navigating cobblestone alleys or trekking through urban parks, its ergonomic footbed ensures all-day comfort without sacrificing your edge.",
    6: "The Court King is the ultimate weapon for professional basketball performance. With its multi-directional grip pattern and responsive Zoom-tech heel, you'll have the traction and bounce needed to execute lightning-fast crossovers and powerful dunks.",
    7: "Endurance meets innovation in the Marathon Elite. Tailored for long-distance specialists, it incorporates moisture-wicking linings and a structural support system that prevents fatigue, allowing you to maintain your peak pace through all 26.2 miles.",
    8: "Set the trend with the Street Style collection. This isn't just footwear; it's a statement. Featuring bold color blocking and premium synthetic leathers, these kicks are the perfect finishing touch for any streetwear enthusiast looking to stand out.",
    9: "Unlock your true athletic potential with Force technology. Designed for high-impact sports, these shoes provide maximum vertical leap support and shock absorption, protecting your joints while you reach new heights on the court or the track.",
    10: "Master any terrain with the Explorer Combat boots. Imported for their superior craftsmanship, they feature waterproof paneling and a military-grade lugged outsole, making them the most comfortable and reliable choice for your toughest outdoor adventures.",
    11: "Exude timeless elegance with our Peep Toe Sandals. Perfectly balanced for summer soirées, these square mid-heel sandals feature a supportive ankle strap and soft, cushioned insoles, ensuring you look stunning and feel comfortable from dawn till dusk.",
    12: "Unleash your inner speed with the Runooo. Built for those who live life in the fast lane, its ultra-responsive lightweight construction and flexible forefoot design make every run feel like a sprint toward greatness."
};

const updateDescriptions = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        for (const [id, description] of Object.entries(descriptions)) {
            await Product.update({ description }, { where: { id } });
            console.log(`Updated product ${id}`);
        }

        console.log('All descriptions updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating descriptions:', error);
        process.exit(1);
    }
};

updateDescriptions();
