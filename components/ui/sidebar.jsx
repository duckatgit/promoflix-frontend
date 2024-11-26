import React, { useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div
                className="sidebar-icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle Sidebar"
            >
                {isCollapsed ? <CiCircleChevRight size={20} className="text-[#E7680F]" /> : <CiCircleChevLeft size={20} className="text-[#E7680F]" />}
            </div>

            <div className="sidebar-content">
                <div className="menu-item">
                    <span className="icon">
                        <img
                            src="/assets/pricing-plans-icon.png"
                            alt="Pricing Plans Icon"
                        />
                    </span>
                    <span className="text">Pricing Plans</span>
                </div>
                <div className="menu-item">
                    <span className="icon">
                        <img src="/assets/billing-icon.png" alt="Billing History Icon" />
                    </span>
                    <span className="text">Billing History</span>
                </div>
            </div>
            <div className="footer">
                <div className="user-info">
                    <img
                        src="https://via.placeholder.com/50"
                        alt="User Profile"
                        className="user-avatar"
                    />
                    <div className="text">
                        <p className="user-name">Name</p>
                        <p className="user-email">Example@email.com</p>
                    </div>
                </div>
            </div>
            <div className="logout">
                <span className="icon">
                    <RiLogoutCircleRLine className="text-[#FF2E00]" size={25} />
                </span>
                <span className="text text-[#ff2f00]">Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;
