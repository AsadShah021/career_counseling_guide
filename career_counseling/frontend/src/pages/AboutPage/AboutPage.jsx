import React from "react";
import "./AboutPage.css"; // Import CSS

const AboutPage = () => {
    return (
        <div className="about-us-page">
            <div className="about-container">
                <h1 className="about-title">About Us</h1>
                <p>
                    Welcome to our Career Counseling platform, where we help students make confident and 
                    informed decisions about their future. We understand that choosing a career path can be 
                    challenging, and our goal is to provide the guidance and resources you need to navigate 
                    this important step.
                </p>
                <p>
                    Our platform is designed to match your interests, skills, and strengths with career options 
                    that align with your goals. We offer tools to explore different fields, understand job trends, 
                    and learn about opportunities in various industries. Additionally, we provide valuable insights 
                    into university admissions, program requirements, and future career prospects.
                </p>
                <p>
                    Whether you're unsure of where to start or need detailed advice about a specific career path, 
                    we're here to guide you every step of the way. Our mission is to empower you with the knowledge 
                    and support needed to build a bright and successful future. Let us help you take the first step 
                    toward achieving your dreams!
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
