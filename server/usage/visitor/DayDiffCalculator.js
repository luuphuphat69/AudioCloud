const BillingVisitor = require('./BillingVisitor');

class DayDiffCalculator extends BillingVisitor {
    calculateDayDiff(billing) {
        const now = new Date();
        const billingDateTimeParts = billing.DateTime.split(/[\s,:/]+/); // Split the date string into its components
        // Parse the components into a Date object (month - 1 because months are zero-indexed in JavaScript)
        const billingDate = new Date(billingDateTimeParts[2], billingDateTimeParts[1] - 1, billingDateTimeParts[0], billingDateTimeParts[3], billingDateTimeParts[4], billingDateTimeParts[5]);
        const diffInTime = now.getTime() - billingDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)); // Calculate difference in days

        console.log(`Day difference for bill ${billing.BillId}: ${diffInDays}`);
    }
}
module.exports = DayDiffCalculator;