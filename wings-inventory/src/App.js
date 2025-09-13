import React, { useState } from "react";
import Dashboard from "./Dashboard";
import ProductManagement from "./productsmanagement";
import StockManagement from "./StockManagement";
import SalesModule from "./SalesModule";
import InventoryModule from "./InventoryModule";
import Reports from "./ReportModule";

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <ProductManagement />;
      case "Stock":
        return <StockManagement />;
      case "Sales":
        return <SalesModule />;
      case "Inventory":
        return <InventoryModule />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-around", 
        padding: "1rem", 
        background: "#333", 
        color: "white" 
      }}>
        {["Dashboard", "Products", "Stock", "Sales", "Inventory", "Reports"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "#555" : "transparent",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal"
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Active Component */}
      <div style={{ padding: "1rem" }}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;
