import { useEffect, useState } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import PoolComponent from "./PoolComponent";
import WithdrawComponent from "./WithdrawComponent";
import FaucetComponent from "./FaucetComponent";
import { PRECISION } from "../constants";

export default function ContainerComponent(props) {
    const [activeTab, setActiveTab] = useState("Swap");
    const [amountOfApples, setAmountOfApples] = useState(0);
    const [amountOfOranges, setAmountOfOranges] = useState(0);
    const [amountOfShare, setAmountOfShare] = useState(0);
    const [totalApples, setTotalApples] = useState(0);
    const [totalOranges, setTotalOranges] = useState(0);
    const [totalShare, setTotalShare] = useState(0);

    useEffect(() => {
        getHoldings();
    });

    // Fetch the pool details and personal assets details.
    async function getHoldings() {
        try {
            console.log("Fetching holdings----");
            let response = await props.contract.getMyHoldings();
            setAmountOfApples(response.amountToken1 / PRECISION);
            setAmountOfOranges(response.amountToken2 / PRECISION);
            setAmountOfShare(response.myShare / PRECISION);

            response = await props.contract.getPoolDetails();
            setTotalApples(response[0] / PRECISION);
            setTotalOranges(response[1] / PRECISION);
            setTotalShare(response[2] / PRECISION);
        } catch (err) {
            console.log("Couldn't Fetch holdings", err);
        }
    }

    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="centerBody">
            <div className="centerContainer">
                <div className="selectTab">
                    <div
                        className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
                        onClick={() => changeTab("Swap")}
                    >
                        Swap
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Pool" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Pool")}
                    >
                        Pool
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Withdraw")}
                    >
                        Withdraw
                    </div>
                    <div
                        className={
                            "tabStyle " + (activeTab === "Faucet" ? "activeTab" : "")
                        }
                        onClick={() => changeTab("Faucet")}
                    >
                        Faucet
                    </div>
                </div>

                {activeTab === "Swap" && (
                    <SwapComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Pool" && (
                    <PoolComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Withdraw" && (
                    <WithdrawComponent
                        contract={props.contract}
                        maxShare={amountOfShare}
                        getHoldings={() => getHoldings()}
                    />
                )}
                {activeTab === "Faucet" && (
                    <FaucetComponent
                        contract={props.contract}
                        getHoldings={() => getHoldings()}
                    />
                )}
            </div>
            <div className="details">
                <div className="detailsBody">
                    <div className="detailsHeader">Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of Apples:</div>
                        <div className="detailsValue">{amountOfApples}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Amount of Oranges:</div>
                        <div className="detailsValue">{amountOfOranges}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Your Share:</div>
                        <div className="detailsValue">{amountOfShare}</div>
                    </div>
                    <div className="detailsHeader">Pool Details</div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total Apples:</div>
                        <div className="detailsValue">{totalApples}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total Oranges:</div>
                        <div className="detailsValue">{totalOranges}</div>
                    </div>
                    <div className="detailsRow">
                        <div className="detailsAttribute">Total Shares:</div>
                        <div className="detailsValue">{totalShare}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}