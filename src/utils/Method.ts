


   export  const formatPrice = (price: string | number) => {
      if (!price) return 'N/A';
      
      // Remove any existing currency symbols and commas
      const numericPrice = typeof price === 'string' 
        ? price.replace(/[₦,NGN\s]/g, '') 
        : price.toString();
      
      // Convert to number
      const priceNum = parseFloat(numericPrice);
      
      if (isNaN(priceNum)) return price;
      
      // Format with commas and NGN symbol
      return `₦${priceNum.toLocaleString('en-NG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    };