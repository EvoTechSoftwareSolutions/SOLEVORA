// Importing required styles and icons
import "../../styles/user/About.css";
import { LuLeaf, CiHeart, FiAward, CiStar, FiUsers, TbWorld, IoBagCheckOutline } from "../../components/common/icons.jsx";
import storyImg from "../../assets/image/manwearshoe.jpg";
import userImg1 from "../../assets/image/user1.jpg";
import userImg2 from "../../assets/image/user2.jpg";
import userImg3 from "../../assets/image/user3.jpg";
import visionImg from "../../assets/image/vision.png";
import missionImg from "../../assets/image/target.png";

const About = () => {
    // Team members data
    const team = [
        { img: userImg1, name: "Saral Villiams", role: "Head of Product Design", dept: "Manager" },
        { img: userImg2, name: "John Carter", role: "Marketing Lead", dept: "Marketing" },
        { img: userImg3, name: "Aisha Rahman", role: "UI/UX Designer", dept: "Design" },
        { img: userImg3, name: "Kamal Perera", role: "Operations Manager", dept: "Operations" }
    ];

    return (
        <div className="main-container">
            {/* About Banner Section */}
            <section className="about-banner">
                <div className="about-text">
                    <h1>
                        About <span className="about-tag">Solevora</span>
                    </h1>
                    <p>
                        Born from a passion for exceptional footwear, we believe that the
                        right pair of shoes can transform your day. We are dedicated to
                        craftsmanship, comfort, and helping you step out in style.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="our-story">
                <img
                    src={storyImg}
                    alt="Our Story Image"
                    className="story-image"
                />
                <div className="story-text">
                    <h2>Our Story</h2>
                    <p>
                        We started with a simple idea to create comfortable everyday shoes.
                        Quality craftsmanship and thoughtful design became the foundation of
                        our journey. Our small team focused on durability, comfort, and
                        modern style. Customers quickly trusted our products for daily wear
                        and long walks. That trust inspired us to grow and improve every
                        collection.
                    </p>
                    <p>
                        Today our store serves customers looking for style, comfort, and
                        reliability. We continue building footwear that supports everyday
                        movement and confidence. Every collection reflects our passion for
                        quality and thoughtful craftsmanship. Customer satisfaction remains
                        the heart of everything our team does. And our journey continues
                        with every step our customers take.
                    </p>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="goal">
                <div className="mission-vision">
                    <div className="mission-vision-head">
                        <img src={missionImg} alt="Mission Icon" />
                        <h3>Mission</h3>
                    </div>
                    <p>To become a leading online footwear brand, redefining style and comfort through a seamless and modern shopping experience.</p>
                </div>
                <div className="mission-vision">
                    <div className="mission-vision-head">
                        <img src={visionImg} alt="Vision Icon" />
                        <h3>Vision</h3>
                    </div>
                    <p>To provide high-quality, stylish, and comfortable shoes at affordable prices through a user-friendly platform, ensuring secure payments.</p>
                </div>
            </section>

            {/* Why We Are Here Section */}
            <section className="why-we">
                {/* Header */}
                <div className="why-us-header">
                    <h1>Why We Are Here</h1>
                    <p>We are providing the best service for you</p>
                </div>

                {/* Features / Cards */}
                <div className="why-us-features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <span><FiAward className="about-icon" /></span>
                        </div>
                        <h5>Quality </h5>
                        <h5>Craftsmanship </h5>
                        <p>
                            Every pair is crafted with premium materials and meticulous attention
                            to detail, ensuring lasting comfort and style.
                        </p>
                    </div>

                    <div className="feature-card center">
                        <div className="feature-icon">
                            <span><LuLeaf className="about-icon" /></span>
                        </div>
                        <h5>Sustainable</h5>
                        <h5>Fashion</h5>
                        <p>
                            Every pair is crafted with premium materials and meticulous attention
                            to detail, ensuring lasting comfort and style.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <span><CiHeart className="about-icon" /></span>
                        </div>
                        <h5>Comfort</h5>
                        <h5>First</h5>
                        <p>
                            Every pair is crafted with premium materials and meticulous attention
                            to detail, ensuring lasting comfort and style.
                        </p>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="stat-card">
                    <TbWorld className="stat-icon" />
                    <h5>45+</h5>
                    <span>Locations Covered</span>
                </div>

                <div className="stat-card">
                    <CiStar className="stat-icon" />
                    <h5>98%</h5>
                    <span>Success Rate</span>
                </div>

                <div className="stat-card">
                    <IoBagCheckOutline className="stat-icon" />
                    <h5>200+</h5>
                    <span>Varieties</span>
                </div>

                <div className="stat-card">
                    <FiUsers className="stat-icon" />
                    <h5>499 999+</h5>
                    <span>Happy Customers</span>
                </div>
            </section>

            <section className="customer-rating">
                <h3>Why Customers Love Us</h3>

                <div className="rating-cards">
                    {/* Card 1 */}
                    <div className="rating-card">
                        <div className="star-row">
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                        </div>
                        <div className="rating-content">
                            <h4>Safety</h4>
                            <span>Well maintained service, money guaranteed</span>
                        </div>
                        <div className="user-info">
                            <img src={userImg3} alt="User" className="user-img" />
                            <div className="rating-users">
                                <span className="user-name">Sajee</span>
                                <span className="review-date">26 March 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rating-card">
                        <div className="star-row">
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>      </div>
                        <div className="rating-content">
                            <h4>Quality</h4>
                            <span>Excellent product quality and comfort confirms</span>
                        </div>
                        <div className="user-info">
                            <img src={userImg1} alt="User" className="user-img" />
                            <div className="rating-users">
                                <span className="user-name">Aisha</span>
                                <span className="review-date">20 March 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="rating-card">
                        <div className="star-row">
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>
                            <CiStar className=" rating-star-icon"/>      </div>
                        <div className="rating-content">
                            <h4>Delivery</h4>
                            <span>Fast delivery, well-packaged products, Delivery</span>
                        </div>
                        <div className="user-info">
                            <img src={userImg2} alt="User" className="user-img" />
                            <div className="rating-users">
                                <span className="user-name">Kamal</span>
                                <span className="review-date">18 March 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="meet-team">
                <h1>Meet the Team</h1>
                <span>The passionate people behind our footwear.</span>

                <div className="team-members">
                    {team.map((member, index) => (
                        <div className="member-card" key={index}>
                            <div className="member-img">
                                <img src={member.img} alt={member.name} />
                            </div>
                            <div className="member-content">
                                <h3>{member.name}</h3>
                                <h4>{member.role}</h4>
                                <span>{member.dept}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;