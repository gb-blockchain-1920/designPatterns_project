export const metamaskCheck = async (ethereum) => {
    //  if metamask is present or not
    if (ethereum) {
        // console.log(ethereum.selectedAddress);
      if (!ethereum.selectedAddress) {
        //  Starts the metamask
        await ethereum.enable();
      }
      return ethereum.selectedAddress;
    } else {
      return undefined;
    }
  };
