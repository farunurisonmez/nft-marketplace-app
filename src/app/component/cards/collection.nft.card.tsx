import React, { useEffect, useState } from 'react';
import { getNFTImage, getNFTMetadata } from '@/app/utils/helpers/nft.helper.util';
import { FaEthereum } from "react-icons/fa";
import { Signer } from 'ethers';
import Image from 'next/image'

interface INftCard {
    signer:Signer,
    imageUrl?:string
}

const CollectionNftCard = (props:INftCard) => {
    const [imageURL, setImageURL] = useState<string>("")

  useEffect(()=>{
    getNFTMetadata({signer:props.signer, tokenId:2}).then((metadata)=>{
        getNFTImage({ipfsImageHash:metadata.image}).then((image)=>{
            setImageURL(image)
        })
    })
  },[])
  
  useEffect(()=>{
   
  },[])

  return (
    <div className='rounded-2xl	bg-slate-800' style={{width:"255px"}}>
        <div className='relative rounded-lg mb-4 overflow-hidden card-media h-full'>
                <Image
                    src={imageURL}
                    alt='NFT Image'
                    className='w-full h-64 object-cover'
                    width={255}
                    height={255}
                />
            </div>
        <h5 className='mb-4 leading-5 font-bold pl-2 pr-2'>
            <a className='none'>
                Nft Name 001
            </a>
        </h5>
        <div className='flex items-center pl-2 pr-2'>
            <div className='w-9 h-9 rounded-full overflow-hidden mr-4 flex-shrink-0'>
                <img className='h-auto w-full align-middle' src={imageURL}/>
            </div>
            <div>
                <span className='text-xs leading-1'>Posted by:</span>
                <a>
                    <h6 className='text-xs leading-2'>Cody</h6>
                </a>
            </div>
        </div>
        <div className='divide-y'></div>
        <div className='flex pl-2 pr-2 items-center justify-between'>
            <span className='text-sm font-normal leading-3'>Current Bid</span>
            <h6 className='flex text-lg font-bold leading-10 items-center'>
                <i className='mr-1'>
                    <FaEthereum/>
                </i>
                0,34
            </h6>
        </div>
    </div>
  );
};

export default CollectionNftCard;
