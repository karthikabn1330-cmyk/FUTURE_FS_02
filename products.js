
// --- Master Data Source ---

window.admins = [
    {
        id: 'admin_1',
        name: 'Karthika Nadar',
        email: 'karthika@knmotors.com',
        businessName: 'KN Motors',
        type: 'seller',
        address: '12, G.G Road, Thane',
        password: 'admin123',
        showrooms: ['sr_1', 'sr_2', 'sr_3', 'sr_7']
    },
    {
        id: 'admin_2',
        name: 'Swayam Rao',
        email: 'swayam@urbanwheels.com',
        businessName: 'Urban Wheels',
        type: 'seller',
        address: '45/B, Indiranagar 100ft Road, Bangalore',
        password: 'admin123',
        showrooms: ['sr_4', 'sr_5', 'sr_8']
    },
    {
        id: 'admin_3',
        name: 'Ratan Patil',
        email: 'ratan@ratanmotors.com',
        businessName: 'Ratan Motors ',
        type: 'seller',
        address: '45/B, Taj Nagar, Delhi',
        password: 'admin123',
        showrooms: ['sr_6']
    }

];

window.showrooms = [
    {
        id: 'sr_1',
        adminId: 'admin_1',
        name: 'KN Motors',
        location: 'Thane, Maharashtra',
        salesCount: 145,
        licenseId: 'GSTIN27AABCP5678'
    },
    {
        id: 'sr_2',
        adminId: 'admin_1',
        name: 'KN Motors',
        location: 'Nerul, Maharashtra',
        salesCount: 89,
        licenseId: 'GSTIN27AABCP5678'
    },
    {
        id: 'sr_3',
        adminId: 'admin_1',
        name: 'KN Motors',
        location: 'Andheri, Maharashtra',
        salesCount: 59,
        licenseId: 'GSTIN27AABCP5678'
    },
    {
        id: 'sr_4',
        adminId: 'admin_2',
        name: 'Urban Rides',
        location: 'Koramangala, Bangalore',
        salesCount: 257,
        licenseId: 'GSTIN29AABCU9012'
    },
    {
        id: 'sr_5',
        adminId: 'admin_2',
        name: 'Urban Rides ',
        location: 'Indiranagar, Bangalore',
        salesCount: 79,
        licenseId: 'GSTIN29AABCU9012'
    },
    {
        id: 'sr_6',
        adminId: 'admin_3',
        name: 'Ratan Motors',
        location: 'South Delhi, Delhi',
        salesCount: 132,
        licenseId: 'GSTIN29AABCU9912'
    },
    {
        id: 'sr_7',
        adminId: 'admin_1',
        name: 'KN Motors',
        location: 'Dadar, Maharashtra',
        salesCount: 74,
        licenseId: 'GSTIN27AABCP5678'
    },

    {
        id: 'sr_8',
        adminId: 'admin_2',
        name: 'Urban Rides ',
        location: 'Thane, Maharashtra',
        salesCount: 59,
        licenseId: 'GSTIN29AABCU9012'
    },
];

window.products = [
    // --- Cars ---
    {
        id: 'c_lux_1',
        name: 'Lamborghini Huracan Evo',
        brand: 'Lamborghini',
        category: 'cars',
        price: 40000000,
        image: 'https://cdn.motor1.com/images/mgl/JYbWM/s3/lamborghini-huracan-evo-feature.jpg',
        description: 'The evolution of the V10. Pure emotion, aerodynamic efficiency.',
        fuel: 'Petrol',
        transmission: 'Automatic/7-speed DCT',
        specs: { engine: '5.2L(5204cc) V10', power: '630 BHP', braking: 'ABS, high-performance discs' },
        showroomId: 'sr_2',

    },
    {
        id: 'c_lux_2',
        name: 'BMW M4 Competition',
        brand: 'BMW',
        category: 'cars',
        price: 15000000,
        image: 'https://vehicle-images.dealerinspire.com/ba35-110006811/WBS33HK03SCT89369/1c6fa8e4cb2531732183f3d29a5f8b39.jpg',
        description: 'High-performance sports coupe combining aggressive styling, chassis tuning, and everyday usability.',
        fuel: 'Petrol',
        transmission: 'Automatic/8-speed',
        showroomId: 'sr_1',
        specs: { engine: '3.0L(2993cc) inline-6 turbo', power: '493 HP', braking: 'Sports brakes + ABS + DSC' },

    },
    {
        id: 'c_1',
        name: 'TATA Harrier EV',
        brand: 'TATA Motors',
        category: 'cars',
        price: 3000000,
        image: 'https://www.indiacarnews.com/wp-content/uploads/2025/04/Tata-Harrier-EV-Details.webp',
        description: 'Full-size electric SUV with family-friendly space and features.',
        fuel: 'Electric',
        transmission: 'EV single speed',
        showroomId: 'sr_4',
        specs: { battery: '75 kWh', power: '390 bhp(290kW) AWD', braking: 'AEBS' },

    },


    // --- Bikes ---
    {
        id: 'b_lux_1',
        name: 'Ducati Panigale V4 R',
        brand: 'Ducati',
        category: 'bikes',
        price: 8500000,
        image: 'https://www.blessthisstuff.com/imagens/listagem/2025/grande/grande_2026-ducati-panigale-v4-r.jpg',
        description: 'Track-focused superbike with cutting-edge aerodynamics, electronics and blistering performance',
        fuel: 'Petrol',
        transmission: '6-speedManual',
        showroomId: 'sr_6',
        specs: { engine: '998 cc V4', power: '221 BHP', braking: 'Brembo Stylema(Dual ABS)' },

    },
    {
        id: 'b_lux_2',
        name: 'Kawasaki Ninja H2',
        brand: 'Kawasaki',
        category: 'bikes',
        price: 3500000,
        image: 'https://s1.cdn.autoevolution.com/images/news/gallery/163-mile-2019-kawasaki-ninja-h2-carbon-hits-the-auction-block-looking-divine_2.jpg',
        description: 'Supercharged superbike with insane acceleration, track-ready tech and aggressive styling.',
        fuel: 'Petrol',
        transmission: '6-speedManual',
        showroomId: 'sr_5',
        specs: { engine: '998 cc Supercharged Inline-4', power: '207 BHP', braking: 'Brembo calipers(Dual ABS)' },

    },
    {
        id: 'b_ind_1',
        name: 'Royal Enfield Classic',
        brand: 'Royal Enfield',
        category: 'bikes',
        price: 220000,
        image: 'https://soymotero.net/wp-content/uploads/2024/09/Royal-Enfield-Bullet-350-Battalion-Black-2025-1.jpg',
        description: 'Iconic cruiser with vintage looks, torquey engine, comfy ride and strong street presence.',
        fuel: 'Petrol',
        transmission: '5-speed Manual',
        specs: { engine: '349cc', power: '20 BHP', braking: 'Dual-ABS' },
        showroomId: 'sr_3',

    },
    {
        id: 'c_lux_3',
        name: 'BMW X3',
        brand: 'BMW',
        category: 'car',
        price: 7100000,
        image: 'https://img.pcauto.com/model/images/modelPic/my/bmw-x3/523766439_1749717147412.png',
        description: 'Mid-size luxury SUV — smooth refinement, spacious cabin, and strong tech features.',
        fuel: 'Petrol',
        transmission: 'Automatic',
        specs: { engine: '2.0L', power: '250 BHP', braking: 'ABS+EBD' },
        showroomId: 'sr_1',

    },
    {
        id: 'c_lux_4',
        name: 'BMW 2 Series Gran Coupe',
        brand: 'BMW',
        category: 'car',
        price: 4550000,
        image: 'https://ik.imagekit.io/girnar/sayaratbay/large/gallery/exterior/4/2069/bmw-2-series-gran-coupe-front-angle-low-view-645238.jpg',
        description: 'Compact premium four-door coupe-style sedan with sporty handling — ideal for city and highway use.',
        fuel: 'Petrol',
        transmission: 'Automatic',
        specs: { engine: '1.5L', power: '150 BHP', braking: 'ABS+EBD' },
        showroomId: 'sr_1',

    },
    {
        id: 'b_1',
        name: 'TVS IQube electric',
        brand: 'TVS',
        category: 'bikes',
        price: 130000,
        image: 'https://images.91wheels.com/assets/b_images/main/models/profile/profile1629208120.png?width=360',
        description: 'Urban commuter EV scooter with smooth throttle, zero emissions and smart connected features.',
        fuel: 'Electric',
        transmission: 'Automatic',
        showroomId: 'sr_7',
        specs: { engine: ' ', power: '7kW (urban e-motor)', braking: 'Disc+ABS' },

    },
    {
        id: 'b_2',
        name: 'TVS Apache RR 310',
        brand: 'TVS',
        category: 'bikes',
        price: 260000,
        image: 'https://5.imimg.com/data5/SELLER/Default/2021/6/KH/CC/HT/65935201/tvs-apache-rr-310-bike-1000x1000.png',
        description: 'Fully-faired sporty bike with aggressive stance, strong brakes and rider aids like riding modes 6-Speed manual transmission.',
        fuel: 'Petrol',
        transmission: '6-Speed manual',
        showroomId: 'sr_7',
        specs: { engine: '312 cc Single, Liquid-cooled', power: '38 BHP', braking: 'Dual Disc+ABS' },

    },
    {
        id: 'b_3',
        name: 'Yamaha FZ-X',
        brand: 'Yamaha',
        category: 'bikes',
        price: 120000,
        image: 'https://vroomhead.com/wp-content/uploads/2023/02/image-2023-02-15T154111.897-768x548.jpg',
        description: 'Neo-retro street bike with upright ergonomics, LED lighting and traction control — ideal for city and mild touring. 5-Speed manual transmission.',
        fuel: 'Petrol',
        transmission: '5-Speed manual',
        showroomId: 'sr_8',
        specs: { engine: '149 cc Single, Air-cooled', power: '12.2 BHP', braking: 'Dual ABS' },

    },
    {
        id: 'c_2',
        name: 'TATA Sierra',
        brand: 'TATA Motors',
        category: 'cars',
        price: 1200000,
        image: 'https://content.carlelo.com/media/models/SierraEV/base/tata-sierra-ev.webp',
        description: 'Retro-styled 5-door SUV with modern features, panoramic sunroof, and ADAS.',
        fuel: 'Petrol',
        transmission: 'DCT',
        showroomId: 'sr_4',
        specs: { battery: '1.5L', power: '105 BHP', braking: 'ABS+EBD' },

    },
    {
        id: 'b_4',
        name: 'Royal Enfield Hunter 350',
        brand: 'Royal Enfield',
        category: 'bikes',
        price: 220000,
        image: 'https://api.gobikes.co.in/uploads/bike/RE-Hunter.png',
        description: 'A lightweight retro-metro cruiser motorcycle ideal for urban riding with agile handling and classic Royal Enfield style',
        fuel: 'Petrol',
        transmission: '5-speed Manual',
        specs: { engine: '349cc', power: '20 BHP', braking: 'Dual Disc' },
        showroomId: 'sr_3',

    },

];

// Initial Order History (Mock)
window.orders = [];
