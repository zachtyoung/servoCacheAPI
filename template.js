const servoGenerator = (servo) => {
  let base = `<li class="product">
  <a
    href="${servo.custom_url.url}"
    data-pid="${servo.id}"
    data-sku="${servo.sku}"
    title="${servo.name}"
    class="card sale"
    data-card-type="product"
    data-context=""
    data-product-name-scheme=""
    data-filter_speed="${servo.custom_fields.filter_speed}"
    data-filter_torque="${servo.custom_fields.filter_torque}"
    data-filter_rotation="${servo.custom_fields.filter_rotation}"
    data-filter_weight="${servo.custom_fields.filter_weight}"
    data-filter_spline="${servo.custom_fields.filter_spline}"
    data-filter_motor_type="${servo.custom_fields.filter_motor_type}"
    data-filter_gear_material="${servo.custom_fields.filter_gear_material}"
    data-filter_brand="${servo.custom_fields.filter_brand}"
    data-filter_circuit="${servo.custom_fields.filter_circuit}"
    data-filter_voltage="${servo.custom_fields.filter_voltage}"
    data-filter_continuous="No"
    data-filter_size="${servo.custom_fields.filter_size}"
  >
    <div class="miniSpecsBox hide"></div>
    <figure class="card-figure">
      <img
        class="lazyload"
        data-sizes="auto"
        data-srcset="${servo.images} 1x"
        data-src="${servo.images}"
        alt="${servo.name}"
        title="${servo.name}"
      />
    </figure>
    <div class="card-body">
      <pre>${servo.sku}</pre>
      <div class="card-title">${servo.name}</div>
      <div class="card-text">
      ${servo.availability?null:<span class="outOfStock">OUT OF STOCK</span>}
        <div class="price-section price-section--withoutTax">
          <span data-product-rrp-without-tax class="price price--rrp"
            >${servo.price}</span
          >
          <span
            data-product-price-without-tax
            class="price price--withoutTax salePrice"
            >$2.36
          </span>
        </div>
      </div>
    </div>
  </a>
</li>`;
  return base;
};

console.log(servoGenerator());
