const COIN=100000000n

const rewardPhase3startHeight=1430000;
const rewardPhase3startSubsidy=2157n*COIN/2n;
const rewardPhase3startDecayNumerator=98884n;
const rewardPhase3startDecayDenominator=100000n;

const rewardPhase4startHeight=12993200;
const rewardPhase4startDecayNumerator=98652n;
const rewardPhase4startDecayDenominator=100000n;

const maxSupply=21000000000n*COIN;

const outputFileName='data.txt';


let fs=require('fs');

const satToFixedWidth=(sat)=>{
    let strValue=sat.toString().padStart(9,'0');    //make sure there are at least 9 digits
    let length=strValue.length;
    return (strValue.substr(0,length-8)+"."+strValue.substr(length-8)).padStart(30," ");
}

const savePoint=(height,reward,supply)=>{
    let temp=height+satToFixedWidth(reward)+satToFixedWidth(supply);
    console.log(temp);
    fs.appendFileSync(outputFileName,temp+"\r\n");
}

let height=rewardPhase3startHeight;
let supply=547587974872189n*COIN/100000n;   //source: https://chainz.cryptoid.info/dgb/block.dws?0000000000000934d3c8d4a9b7f4632065102f465d93a04da5a8f29732bd292c.htm
let reward=rewardPhase3startSubsidy;

let save=true
while (supply<maxSupply) {
    if (save) savePoint(height,reward,supply);
    save=false;

    //update state
    height++;
    if (height>=rewardPhase4startHeight) {
        //phase 4
        if ((height-rewardPhase4startHeight)%175200===0) {
            //new reward height
            reward*=rewardPhase4startDecayNumerator;
            reward/=rewardPhase4startDecayDenominator;
            save=true;
        }

    } else {
        //phase 3
        if ((height-rewardPhase3startHeight)%175200===0) {
            //new reward height
            reward*=rewardPhase3startDecayNumerator;
            reward/=rewardPhase3startDecayDenominator;
            save=true;
        }
    }
    supply+=reward;
}
savePoint(height,reward,supply);