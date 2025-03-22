import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRewards } from "./rewardsSlice";
import styled, { createGlobalStyle } from "styled-components";
import Loader from "../../components/common/Loader";
import { FaShoppingCart, FaHistory } from "react-icons/fa"; // Import history icon
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const RewardsList = () => {
  const dispatch = useDispatch();
  const { rewards, status, error } = useSelector((state) => state.rewards);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("points-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart popup visibility
  const [redemptionHistory, setRedemptionHistory] = useState([]); // State for redemption history
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // State for history popup visibility

  useEffect(() => {
    if (status === "idle") dispatch(fetchRewards());
  }, [status, dispatch]);

  const filteredRewards = rewards && rewards.length > 0
    ? rewards
        .filter(reward => {
          if (filter === "all") return true;
          return reward.category === filter;
        })
        .filter(reward => 
          reward.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "points-asc") return a.pointsCost - b.pointsCost;
          if (sortBy === "points-desc") return b.pointsCost - a.pointsCost;
          return a.name.localeCompare(b.name);
        })
    : [];

  const handleAddToCart = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    setCart((prevCart) => [...prevCart, reward]);
    // Show toast notification
    toast.success(`${reward.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleRemoveFromCart = (rewardId) => {
    setCart((prevCart) => prevCart.filter(r => r.id !== rewardId));
  };

  const totalPoints = cart.reduce((total, reward) => total + reward.pointsCost, 0);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleCheckout = () => {
    // Simulate redemption process
    const newRedemptions = cart.map(reward => ({
      id: Date.now() + Math.random(), // Unique ID for each redemption
      name: reward.name,
      pointsCost: reward.pointsCost,
      date: new Date().toLocaleString(),
      status: "Pending" // Initial status
    }));

    // Add to redemption history
    setRedemptionHistory((prevHistory) => [...prevHistory, ...newRedemptions]);

    // Simulate status update after a delay
    setTimeout(() => {
      setRedemptionHistory((prevHistory) =>
        prevHistory.map(item =>
          newRedemptions.some(newItem => newItem.id === item.id)
            ? { ...item, status: Math.random() > 0.2 ? "Completed" : "Failed" } // 80% chance of success
            : item
        )
      );
    }, 2000); // Simulate 2-second processing time

    // Clear cart after checkout
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <h2>Rewards Marketplace</h2>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSelect
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="giftcards">Gift Cards</option>
            <option value="merchandise">Merchandise</option>
          </FilterSelect>

          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="points-asc">Points: Low to High</option>
            <option value="points-desc">Points: High to Low</option>
            <option value="name">Name: A-Z</option>
          </SortSelect>

          <CartIcon onClick={toggleCart}>
            <FaShoppingCart size={24} />
            {cart.length > 0 && <CartBadge>{cart.length}</CartBadge>}
          </CartIcon>

          <HistoryIcon onClick={toggleHistory}>
            <FaHistory size={24} />
            {redemptionHistory.length > 0 && <HistoryBadge>{redemptionHistory.length}</HistoryBadge>}
          </HistoryIcon>
        </Controls>

        {status === "loading" && <Loader />}
        {status === "failed" && <ErrorMessage>Error: {error}</ErrorMessage>}
        
        <RewardGrid>
          {filteredRewards.length > 0 ? (
            filteredRewards.map((reward) => (
              <RewardCard key={reward.id}>
                <img src={reward.image} alt={reward.name} />
                <h3>{reward.name}</h3>
                <Description>{reward.description || "No description available"}</Description>
                <p>{reward.pointsCost} Points</p>
                <RedeemButton onClick={() => handleAddToCart(reward.id)}>
                  Add to Cart
                </RedeemButton>
              </RewardCard>
            ))
          ) : (
            <p>No rewards found</p>
          )}
        </RewardGrid>

        {isCartOpen && (
          <CartModal>
            <CartOverlay onClick={toggleCart} />
            <CartContent>
              <CartHeader>
                <h3>Your Cart</h3>
                <CloseButton onClick={toggleCart}>×</CloseButton>
              </CartHeader>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <CartItems>
                  {cart.map((reward) => (
                    <CartItem key={reward.id}>
                      <CartItemImage src={reward.image} alt={reward.name} />
                      <CartItemDetails>
                        <span>{reward.name}</span>
                        <span>{reward.pointsCost} Points</span>
                      </CartItemDetails>
                      <RemoveButton onClick={() => handleRemoveFromCart(reward.id)}>
                        Remove
                      </RemoveButton>
                    </CartItem>
                  ))}
                </CartItems>
              )}
              <TotalPoints>Total Points: {totalPoints}</TotalPoints>
              {cart.length > 0 && (
                <CheckoutButton onClick={handleCheckout}>Proceed to Checkout</CheckoutButton>
              )}
            </CartContent>
          </CartModal>
        )}

        {isHistoryOpen && (
          <HistoryModal>
            <HistoryOverlay onClick={toggleHistory} />
            <HistoryContent>
              <HistoryHeader>
                <h3>Redemption History</h3>
                <CloseButton onClick={toggleHistory}>×</CloseButton>
              </HistoryHeader>
              {redemptionHistory.length === 0 ? (
                <p>No redemption history yet.</p>
              ) : (
                <HistoryTable>
                  <thead>
                    <tr>
                      <th>Reward</th>
                      <th>Points</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptionHistory.map((item) => (
                      <HistoryRow key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.pointsCost}</td>
                        <td>{item.date}</td>
                        <td>
                          <StatusBadge status={item.status}>
                            {item.status}
                          </StatusBadge>
                        </td>
                      </HistoryRow>
                    ))}
                  </tbody>
                </HistoryTable>
              )}
            </HistoryContent>
          </HistoryModal>
        )}
      </Container>
      <ToastContainer />
    </>
  );
};

export default RewardsList;

// Global Styles
const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => (theme === "dark" ? "#121212" : "#f8f9fa")};
    color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
    font-family: 'Poppins', sans-serif;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  }
`;

// Styled Components
const Container = styled.div`
  padding: 30px 20px;
  max-width: 1000px;
  margin: 80px auto 0;
  text-align: center;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 200px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const SortSelect = styled(FilterSelect)``;

const CartIcon = styled.div`
  cursor: pointer;
  position: relative;
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  display: flex;
  align-items: center;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const HistoryIcon = styled.div`
  cursor: pointer;
  position: relative;
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  display: flex;
  align-items: center;
`;

const HistoryBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  font-size: 16px;
`;

const RewardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RewardCard = styled.div`
  background: ${({ theme }) => (theme === "dark" ? "#2a2a2a" : "#ffffff")};
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease-in-out;
  box-shadow: ${({ theme }) =>
    theme === "dark" ? "2px 2px 10px rgba(255, 255, 255, 0.1)" : "2px 2px 10px rgba(0, 0, 0, 0.1)"};

  &:hover {
    background: ${({ theme }) => (theme === "dark" ? "#3a3a3a" : "#eee")};
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
  }

  p {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.8;
  }
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin: 5px 0;
  opacity: 0.7;
`;

const RedeemButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  margin-top: 15px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2980b9;
    transform: scale(1.05);
  }
`;

const CartModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CartOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const CartContent = styled.div`
  background: ${({ theme }) => (theme === "dark" ? "#2a2a2a" : "#ffffff")};
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
`;

const CartItems = styled.div`
  margin-top: 10px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => (theme === "dark" ? "#3a3a3a" : "#eee")};
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background: #c0392b;
  }
`;

const TotalPoints = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
`;

const CheckoutButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  margin-top: 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background: #27ae60;
    transform: scale(1.02);
  }
`;

// Styled Components for History Popup
const HistoryModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const HistoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const HistoryContent = styled.div`
  background: ${({ theme }) => (theme === "dark" ? "#2a2a2a" : "#ffffff")};
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => (theme === "dark" ? "#2a2a2a" : "#ffffff")};
  color: ${({ theme }) => (theme === "dark" ? "#ffffff" : "#333")};
  border-radius: 10px;
  overflow: hidden;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => (theme === "dark" ? "#3a3a3a" : "#eee")};
  }

  th {
    background: ${({ theme }) => (theme === "dark" ? "#3a3a3a" : "#f1f1f1")};
    font-weight: 600;
  }
`;

const HistoryRow = styled.tr`
  &:hover {
    background: ${({ theme }) => (theme === "dark" ? "#3a3a3a" : "#f9f9f9")};
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  color: white;
  background: ${({ status }) =>
    status === "Completed" ? "#2ecc71" :
    status === "Pending" ? "#f39c12" :
    "#e74c3c"};
`;