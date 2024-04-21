export default class StockToSellRequest {
    constructor(body, userId) {
        this.userId = userId,
        this.title = body.title,
        this.description = body.description,
        this.type = body.type,
        this.commodity = {
            name: body.commodity.name,
            subCommodity: body.commodity.subCommodity
        },
        this.quantityOfPurchase = {
            number: body.quantityOfPurchase.number,
            unit: body.quantityOfPurchase.unit,
        },
        this.locationOfStock = {
            region: body.locationOfStock.region,
            province: body.locationOfStock.province,
            municipality: body.locationOfStock.municipality,
            barangay: body.locationOfStock.barangay,
            otherInformation: body.locationOfStock.otherInformation,
        },
        this.partialOffer = body.partialOffer,
        this.packingType = body.packingType,
        this.floorPrice = body.floorPrice,
        this.status = body.status
    }
}