import { Signer } from "ethers";

interface INftHelper {
    signer?: Signer | undefined
    walletAddress?: string
}

export interface IMintNFT extends INftHelper {
    name: string
    description: string
    artist: string
    file: File
}

export interface IGetTokenSupply extends INftHelper {

}

export interface IIsOwner extends INftHelper {
    tokenId: number
}

export interface IGetNFTMetadata extends INftHelper {
    tokenId: number
}

export interface IGetNFTImage extends INftHelper{
    ipfsImageHash:string,
}