import {Nft} from './Nft';

export interface SkillShopListing extends Nft {
  isConsumable: boolean;
  name: string;
  description: string;
  image: string;
  isSoldOut: boolean
  supply: number;
  isDisable: boolean;
  nftPriceXgem: string;
  isDisableXgem: boolean;
}
