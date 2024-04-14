import { getNftContract } from "./contractAccessHelper";
import { uploadJSON, uploadFile, retrieveFile, retrieveJSON } from "./ipfsHelper";
import { ethers, Signer } from 'ethers'
import { IMintNFT, IGetTokenSupply, IIsOwner, IGetNFTMetadata, IGetNFTImage } from "../../types/interfaces/helpers/nft.helper.interface";

/**
 * Yeni bir NFT oluşturarak kontrata ekler (mintleme işlemi).
 *
 * @param {Object} props - Fonksiyon için giriş özellikleri.
 * @param {import('./types').IMintNFT} props - Giriş özellikleri için tip tanımı.
 * @param {import('./types').ISigner} props.signer - NFT kontratına erişim için kullanılacak imzalayıcı.
 * @param {string} props.walletAddress - NFT'nin sahibi olacak cüzdan adresi.
 * @param {string} props.file - Yüklenen dosyanın yolunu temsil eden bir dize.
 * @param {string} props.name - NFT'nin adı.
 * @param {string} props.description - NFT'nin açıklaması.
 * @param {string} props.artist - Sanatçının adı.
 *
 * @returns {Promise<void>} Mintleme işlemi tamamlandığında bir Promise döner.
 *
 * @throws {Error} Mintleme işlemi sırasında bir hata olması durumunda bir hata fırlatır.
 */
export const mintNFT = async (props:IMintNFT) => {
    if (!props.signer) {
        throw new Error('Signer is undefined');
    }

    let contract = await getNftContract(props.signer);

    let ipfsImageHash = await uploadFile(props.file);

    let metadata = {
        name: props.name,
        description : props.description,
        image: ipfsImageHash,
        external_url: "https://efsoftworks.github.io/nft-marketplace-app/",
        attributes:[
            {
                trait_type: "artist",
                value:props.artist
            }
        ]
    }

    let ipfsMetadataHash = await uploadJSON(metadata);
    let tokenId = (await getTokenSupply({signer:props.signer})) + 1;

    try {
        let transaction = await contract["mint(address,uint256,string)"](props.walletAddress, tokenId, ipfsMetadataHash);
        let result = await transaction.wait();
        return result;
    } catch (err:any) {
        return err.message;
    }
}

/**
 * NFT kontratındaki toplam token arzını alır.
 *
 * @param {Object} props - Fonksiyon için giriş özellikleri.
 * @param {import('./types').IGetTokenSupply} props - Giriş özellikleri için tip tanımı.
 * @param {import('./types').ISigner} props.signer - NFT kontratına erişim için kullanılacak imzalayıcı.
 *
 * @returns {Promise<number>} NFT kontratındaki toplam token arzını içeren bir Promise.
 *
 * @throws {Error} Token arzını alırken bir hata olması durumunda bir hata fırlatır.
 */
export const getTokenSupply = async (props:IGetTokenSupply) => {
    if (!props.signer) {
        throw new Error('Signer is undefined');
    }

    let contract = await getNftContract(props.signer)

    return parseInt(await contract["totalSupply()"].call())
}

/**
 * Belirtilen cüzdan adresinin, belirtilen NFT tokenının sahibi olup olmadığını kontrol eder.
 *
 * @param {Object} props - Fonksiyon için giriş özellikleri.
 * @param {import('./types').IIsOwner} props - Giriş özellikleri için tip tanımı.
 * @param {string} props.walletAddress - Sahiplik kontrolü yapılacak cüzdan adresi.
 * @param {string} props.tokenId - NFT tokenının kimliği.
 * @param {import('./types').ISigner} props.signer - NFT kontratı için kullanılacak imzalayıcı.
 *
 * @returns {Promise<boolean>} Cüzdan adresi belirtilen tokenın sahibi ise true, aksi halde false dönen bir Promise.
 *
 * @throws {Error} NFT kontratının alınması veya sahiplik kontrolü yapılırken bir sorun olması durumunda bir hata fırlatır.
 */
export const isOwner = async (props:IIsOwner) => {
    if (!props.signer) {
        throw new Error('Signer is undefined');
    }

    let contract = await getNftContract(props.signer)

    let owner = await contract["ownerOf(tokenId)"](props.tokenId).call();

    return owner === (await props.walletAddress);
}

/**
 * NFT tokenının metaverilerini alır.
 *
 * @param {Object} props - Fonksiyon için giriş özellikleri.
 * @param {import('./types').IGetNFTMetadata} props - Giriş özellikleri için tip tanımı.
 * @param {import('./types').ISigner} props.signer - NFT kontratına erişim için kullanılacak imzalayıcı.
 * @param {string} props.tokenId - NFT tokenının kimliği.
 *
 * @returns {Promise<any>} NFT tokenının metaverilerini içeren bir Promise.
 *
 * @throws {Error} NFT tokenının metaverilerini alırken bir hata olması durumunda bir hata fırlatır.
 */

export const getNFTMetadata = async (props:IGetNFTMetadata) => {
    if (!props.signer) {
        throw new Error('Signer is undefined');
    }
    
    let contract = await getNftContract(props.signer)
    let metadataHash = await contract["tokenURI"](props.tokenId);
    return await retrieveJSON(metadataHash)
}

/**
 * IPFS'den bir NFT resmi alır.
 *
 * @param {IGetNFTImage} props - NFT resmini almak için özellikler.
 * @param {string} props.ipfsImageHash - Resmin IPFS hash'i.
 * @returns {Promise<any>} Alınan dosyayı çözen bir promise döndürür.
 */
export const getNFTImage = async (props:IGetNFTImage) => {
    let ipfsImageHash = props.ipfsImageHash
    console.log(ipfsImageHash,"hey")
    return await retrieveFile(ipfsImageHash);
}