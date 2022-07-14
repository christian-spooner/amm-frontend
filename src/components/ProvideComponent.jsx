import { MdAdd } from "react-icons/md";
import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function ProvideComponent(props) {
    const [amountOfApples, setAmountOfApples] = useState(0);
    const [amountOfOranges, setAmountOfOranges] = useState(0);
    const [error, setError] = useState("");

    // Gets estimates of a token to be provided in the pool given the amount of other token
    const getProvideEstimate = async (token, value) => {
        if (["", "."].includes(value)) return;
        if (props.contract !== null) {
            try {
                let estimate;
                if (token === "Apples") {
                    estimate = await props.contract.getEquivalentToken2Estimate(
                        value * PRECISION
                    );
                    setAmountOfOranges(estimate / PRECISION);
                } else {
                    estimate = await props.contract.getEquivalentToken1Estimate(
                        value * PRECISION
                    );
                    setAmountOfApples(estimate / PRECISION);
                }
            } catch (err) {
                if (err?.data?.message?.includes("Zero Liquidity")) {
                    setError("Message: Empty pool. Set the initial conversion rate.");
                } else {
                    alert(err?.data?.message);
                }
            }
        }
    };

    const onChangeAmountOfApples = (e) => {
        setAmountOfApples(e.target.value);
        getProvideEstimate("Apples", e.target.value);
    };

    const onChangeAmountOfOranges = (e) => {
        setAmountOfOranges(e.target.value);
        getProvideEstimate("Oranges", e.target.value);
    };

    // Adds liquidity to the pool
    const provide = async () => {
        if (["", "."].includes(amountOfApples) || ["", "."].includes(amountOfOranges)) {
            alert("Amount should be a valid number");
            return;
        }
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        } else {
            try {
                let response = await props.contract.provide(
                    amountOfApples * PRECISION,
                    amountOfOranges * PRECISION
                );
                await response.wait();
                setAmountOfApples(0);
                setAmountOfOranges(0);
                await props.getHoldings();
                alert("Success");
                setError("");
            } catch (err) {
                err && alert(err?.data?.message);
            }
        }
    };

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of Apples"}
                value={amountOfApples}
                onChange={(e) => onChangeAmountOfApples(e)}
            />
            <div className="swapIcon">
                <MdAdd />
            </div>
            <BoxTemplate
                leftHeader={"Amount of Oranges"}
                value={amountOfOranges}
                onChange={(e) => onChangeAmountOfOranges(e)}
            />
            <div className="error">{error}</div>
            <div className="bottomDiv">
                <div className="btn" onClick={() => provide()}>
                    Provide
                </div>
            </div>
        </div>
    );
}
