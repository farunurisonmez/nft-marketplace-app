import React, { useEffect, useState } from 'react';
import NftCard from '../cards/collection.nft.card';
import { getTokenSupply, isOwner } from '@/app/utils/helpers/nft.helper.util';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { getSigner } from '@/app/utils/helpers/wallet.helper.util';
import { Signer } from 'ethers';

interface IGetTokenStatus {
    signer: Signer
    tokenId: number
    walletAddress: string | undefined
}

const getNFTStatus = async (props: IGetTokenStatus) => {
    let owner;

    try {
        owner = await isOwner({
            signer: props.signer,
            tokenId: props.tokenId,
            walletAddress: props.walletAddress
        });
    } catch (e) {
        owner = false;
    }

    return {
        owner
    }
}

const AccountsTabs = () => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [activeTab, setActiveTab] = useState('collection');

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const Collection = () => {
        const [ownedNFTs, setOwnedNFTs] = useState<JSX.Element[]>([])
        const { walletProvider } = useWeb3ModalProvider();


        const loadOwnedNFTs = async () => {
            const { signer } = await getSigner(walletProvider);
            let maxOwnedNft = await getTokenSupply({ signer: signer });
            let nftCards: JSX.Element[] = [];

            for (let i = 1; i <= maxOwnedNft; i++) {
                const {
                    owner
                } = await getNFTStatus({ tokenId: i, signer: signer, walletAddress: address });

                const isCurrentOwner = ownedNFTs

                if (isCurrentOwner) {
                    nftCards.push(
                        <NftCard signer={signer} key={i}/>
                    )
                }
            }

            return nftCards
        }

        useEffect(() => {
            loadOwnedNFTs().then((res) => setOwnedNFTs(res));

            const intervalId = setInterval(() => loadOwnedNFTs().then((o) => setOwnedNFTs(o)),
                30000
            );

            return () => clearInterval(intervalId);
        }, [])

        return (
            <div className='flex gap-10'>
                {ownedNFTs.map((a, i) => (
                    <div key={i}>
                        {a}
                    </div>
                ))
                }
            </div>
        )
    }


    return (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className='mx-auto w-full max-w-[2560px] px-4 sm:px-8 xl:px-16'>
                <nav className='w-full'>
                    <div className='flex justify-between duration-[250ms] items-end py-4 transition-all lg:py-6 pb-3'>
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center p-0 w-full m-0" id="default-tab" role="tablist">
                            <div className='flex m-0 -ml-2 gap-2'>
                                <li className="me-2 relative list-none" role="presentation">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg text-lg font-bold ${activeTab === 'collection' ? 'text-black dark:text-blue-900' : 'text-sky-50'}`}
                                        onClick={() => handleTabClick('collection')}
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected={activeTab === 'collection'}
                                    >
                                        Collection
                                    </button>
                                </li>
                                <li className="me-2" role="presentation">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg text-lg font-bold ${activeTab === 'created' ? 'text-black dark:text-blue-900' : 'text-sky-50'}`}
                                        onClick={() => handleTabClick('created')}
                                        role="tab"
                                        aria-controls="dashboard"
                                        aria-selected={activeTab === 'created'}
                                    >
                                        Created
                                    </button>
                                </li>
                                <li className="me-2" role="presentation">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg text-lg font-bold ${activeTab === 'favorited' ? 'text-black dark:text-blue-900' : 'text-sky-50'}`}
                                        onClick={() => handleTabClick('favorited')}
                                        role="tab"
                                        aria-controls="favorited"
                                        aria-selected={activeTab === 'favorited'}
                                    >
                                        Favorited
                                    </button>
                                </li>
                                <li role="presentation">
                                    <button
                                        className={`inline-block p-4 rounded-t-lg text-lg font-bold ${activeTab === 'activity' ? 'text-black dark:text-blue-900' : 'text-sky-50'}`}
                                        onClick={() => handleTabClick('activity')}
                                        role="tab"
                                        aria-controls="activity"
                                        aria-selected={activeTab === 'activity'}
                                    >
                                        Activity
                                    </button>
                                </li>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>
            <div id="default-tab-content" className='flex w-full pt-0 lg:pt-6'>
                <div
                    className={`p-4 ${activeTab === 'collection' ? 'block' : 'hidden'}`}
                    role="tabpanel"
                >
                    <Collection />
                </div>
                <div
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'created' ? 'block' : 'hidden'}`}
                    role="tabpanel"
                >
                    No items found
                </div>
                <div
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'favorited' ? 'block' : 'hidden'}`}
                    role="tabpanel"
                >
                    No items found
                </div>
                <div
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'activity' ? 'block' : 'hidden'}`}
                    role="tabpanel"
                >
                    No items found
                </div>
            </div>
        </div>
    );
};

export default AccountsTabs;
