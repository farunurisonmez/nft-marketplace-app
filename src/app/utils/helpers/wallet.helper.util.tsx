import { ethers } from 'ethers'

export const getSigner = async (walletProvider: any) => {
  if (!walletProvider) {
      throw Error('Wallet provider not available')       
  }

  const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
  const signer = await ethersProvider.getSigner()

  return { signer };
}

export const shortenWalletAddress = (address:string | undefined) => {
    if (!address) return "";
    
    const firstFour = address.slice(0, 4);
    const lastSix = address.slice(-6);
    
    return `${firstFour}...${lastSix}`;
}