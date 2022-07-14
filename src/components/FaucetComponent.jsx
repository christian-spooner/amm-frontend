import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
    const [amountOfApples, setAmountOfApples] = useState(0);
    const [amountOfOranges, setAmountOfOranges] = useState(0);

    const onChangeAmountOfOranges = (e) => {
        setAmountOfOranges(e.target.value);
    };

    const onChangeAmountOfApples = (e) => {
        setAmountOfApples(e.target.value);
    };
	
    // Funds the account with given amount of Tokens 
    async function onClickFund() {
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        }
        if (["", "."].includes(amountOfApples) || ["", "."].includes(amountOfOranges)) {
            alert("Amount should be a valid number");
            return;
        }
        try {
            let response = await props.contract.faucet(
                amountOfApples * PRECISION,
                amountOfOranges * PRECISION
            );
            let res = await response.wait();
            console.log("res", res);
            setAmountOfApples(0);
            setAmountOfOranges(0);
            await props.getHoldings();
            alert("Success");
        } catch (err) {
            err?.data?.message && alert(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of Apples"}
                right={"Apples"}
                value={amountOfApples}
                onChange={(e) => onChangeAmountOfApples(e)}
            />
            <BoxTemplate
                leftHeader={"Amount of Oranges"}
                right={"Oranges"}
                value={amountOfOranges}
                onChange={(e) => onChangeAmountOfOranges(e)}
            />
            <div className="bottomDiv">
                <div className="btn" onClick={() => onClickFund()}>
                    Fund
                </div>
            </div>
        </div>
    );
}
