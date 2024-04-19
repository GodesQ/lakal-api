export default class OpenToBuyRequest {
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
        this.locationOfDelivery = {
            region: body.locationOfDelivery.region,
            province: body.locationOfDelivery.province,
            municipality: body.locationOfDelivery.municipality,
            barangay: body.locationOfDelivery.barangay,
            otherInformation: body.locationOfDelivery.otherInformation,
        },
        this.dateOfDelivery = body.dateOfDelivery,
        this.dateOfAuction = body.dateOfAuction,
        this.partialFulfillment = body.partialFulfillment,
        this.supplierQualification = body.supplierQualification,
        this.ceilingPrice = body.ceilingPrice,
        this.status = body.status
    }
}