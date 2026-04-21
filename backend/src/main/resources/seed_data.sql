-- 1. users
COPY public.users (id, created_at, updated_at, active, avatar_url, email, full_name, password, phone, role, two_factor_enrolled_at, two_factor_method, two_factor_enabled, date_of_birth, gender, deleted_at, deleted, email_verified, status) FROM stdin;
5	2026-04-16 02:13:47.297166	2026-04-16 02:13:47.297229	t	\N	phamthanhtu12c@gmail.com	Thanh Tú Phạm	$2a$10$6z5P9oMqFm9D23/QmrpeVe5tpgGRqLhy8aLY.Y0mgggY31nELs3wy	0988345678	ROLE_CUSTOMER	\N	\N	f	\N	\N	\N	f	f	ACTIVE
6	2026-04-16 02:38:31.988756	2026-04-17 08:31:27.143475	t	\N	phamtu@gmail.com	Phạm Tú	$2a$10$GnX24bO7LnZM.Oqj2.BLYuWi4icliE7GGl6cy4imElQJ9/VKmIJrq	0988345675	ROLE_CUSTOMER	\N	\N	f	\N	\N	\N	f	f	ACTIVE
7	2026-04-17 09:06:41.268822	2026-04-17 09:06:41.268877	t	\N	phamtu12c@gmail.com	Phạm Thanh Tú	$2a$10$K29n1AlF0GsmczwLRxp6x.K998q6Dw1.FeAvnZjZBqPlbsv7ArF..	\N	ROLE_ADMIN	\N	\N	f	\N	\N	\N	f	t	ACTIVE
4	2026-04-14 13:06:27.222677	2026-04-17 10:28:46.593068	t	\N	customer@gmail.com	John Doe	$2a$10$2D0ubqeIUkJzoGSDE9NOcenqKt6n1mRMoja54UudVtk13wDDSVeCm	\N	ROLE_STAFF	\N	\N	f	\N	\N	\N	f	f	ACTIVE
3	2026-04-14 13:06:26.952447	2026-04-20 21:00:27.058948	t	\N	admin@techstore.com	System Admin	$2a$10$KeUrAbnVED0xMsvM8Yn0PeCPiaaUh./dUlezklDEfPV3jKQOkZOVW	0988984597	ROLE_SUPER_ADMIN	\N	\N	f	2001-06-13	MALE	\N	f	f	ACTIVE
\.

-- 2. brands
COPY public.brands (id, created_at, updated_at, description, logo_url, name, slug) FROM stdin;
1	2026-04-14 12:37:53.370013	2026-04-14 12:37:53.370045	\N	\N	Apple	apple
2	2026-04-14 12:37:53.37549	2026-04-14 12:37:53.375537	\N	\N	Samsung	samsung
4	2026-04-14 13:53:38.734217	2026-04-14 13:53:38.734372	\N	\N	ASUS	asus
5	2026-04-14 13:53:38.849106	2026-04-14 13:53:38.849157	\N	\N	Sony	sony
6	2026-04-14 13:53:38.899059	2026-04-14 13:53:38.899109	\N	\N	Dell	dell
7	2026-04-14 13:53:38.94632	2026-04-14 13:53:38.946371	\N	\N	Xiaomi	xiaomi
8	2026-04-14 13:53:38.974522	2026-04-14 13:53:38.974564	\N	\N	HP	hp
9	2026-04-14 13:53:39.001941	2026-04-14 13:53:39.001982	\N	\N	Logitech	logitech
10	2026-04-14 13:53:39.029322	2026-04-14 13:53:39.029368	\N	\N	Keychron	keychron
11	2026-04-14 13:53:39.055335	2026-04-14 13:53:39.055393	\N	\N	Microsoft	microsoft
12	2026-04-14 13:53:39.084012	2026-04-14 13:53:39.084085	\N	\N	Garmin	garmin
13	2026-04-14 13:53:39.131796	2026-04-14 13:53:39.131846	\N	\N	Oppo	oppo
14	2026-04-14 13:53:39.163501	2026-04-14 13:53:39.16355	\N	\N	Anker	anker
16	2026-04-16 13:47:57.033392	2026-04-16 13:47:57.033438	\N	\N	Acer	acer
17	2026-04-16 13:47:57.061741	2026-04-16 13:47:57.061768	\N	\N	Lenovo	lenovo
18	2026-04-16 13:47:57.175843	2026-04-16 13:47:57.175868	\N	\N	MSI	msi
\.

-- 3. categories
COPY public.categories (id, created_at, updated_at, active, description, name, slug, parent_id, icon, image_url, sort_order) FROM stdin;
6	2026-04-14 13:53:38.792518	2026-04-15 05:42:16.991862	t		Phụ kiện	phu-kien	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776231735/techstore/categories/cspr9gvgon22c6vugnwg.webp	\N
5	2026-04-14 13:53:38.759571	2026-04-15 05:44:07.249066	t		Tablet	tablet	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776231845/techstore/categories/kcdvyntfzxqjbv89gm4d.webp	\N
1	2026-04-14 12:37:53.380048	2026-04-15 05:44:59.071823	t		Điện tử	dien-tu	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776231897/techstore/categories/sbnyy6b2m77yokverscc.webp	\N
7	2026-04-18 07:52:40.024369	2026-04-18 07:52:40.024394	t		Đồng hồ	dong-ho	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776498751/techstore/categories/m5ueyejiwqrf0sbr1gmu.webp	0
2	2026-04-14 12:37:53.385343	2026-04-18 07:54:10.265527	t		Điện thoại	dien-thoai	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776498845/techstore/categories/f1ekhmbkqj1jf9uvpx8m.webp	0
4	2026-04-14 13:53:38.696455	2026-04-18 07:54:26.213873	t		Laptop	laptop	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776498863/techstore/categories/ssdbk4cuzimngsseedd7.webp	0
3	2026-04-14 12:37:53.389936	2026-04-21 13:32:14.617582	f		iPhone	iphone	2	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776231870/techstore/categories/l6tjoyzdsh9rt3q7zzgo.webp	0
9	2026-04-18 07:57:55.745917	2026-04-21 13:32:20.525805	f		Đồ gia dụng	do-gia-dung	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776499072/techstore/categories/hkisfucqf1hb2emdxg8y.webp	0
8	2026-04-18 07:56:28.635464	2026-04-21 13:32:23.963739	f		 Tivi	ti-vi	\N	\N	http://res.cloudinary.com/dssehge7q/image/upload/v1776498984/techstore/categories/pjtfqgld6kuapd0rm1gv.webp	0
\.

-- 4. coupons
COPY public.coupons (id, created_at, updated_at, active, code, discount_type, discount_value, expiration_date, max_discount, min_purchase, usage_limit, used_count, version) FROM stdin;
2	2026-04-14 12:37:53.431455	2026-04-14 12:37:53.431481	t	WELCOME50K	FIXED_AMOUNT	50000.00	2027-04-14 12:37:53.430667	\N	0.00	1000	0	0
1	2026-04-14 12:37:53.425193	2026-04-20 10:18:19.507463	t	TECHSTORE2024	PERCENT	10.00	2026-05-14 00:00:00	500000.00	2000000.00	100	0	1
\.

-- 5. carts
COPY public.carts (id, created_at, updated_at, session_id, user_id) FROM stdin;
1	2026-04-14 14:53:52.319161	2026-04-14 14:53:52.319223	\N	3
2	2026-04-16 02:59:16.105887	2026-04-16 02:59:16.105945	\N	6
\.

-- 6. addresses
COPY public.addresses (id, created_at, updated_at, detailed_address, district, is_default, phone, province, receiver_name, ward, user_id) FROM stdin;
2	2026-04-14 13:06:27.230257	2026-04-14 13:06:27.23031	123 Lê Lợi	Quận 1	t	0987654321	Hồ Chí Minh	John Doe	Phường Bến Nghé	4
3	2026-04-14 15:04:58.716647	2026-04-14 15:49:54.35474	Khu 9	Thanh Hà	f	0901234567	Hải Dương 	Admin	Thị trấn Thanh Hà	3
5	2026-04-16 06:44:07.719408	2026-04-16 06:44:20.986889	Khu 7	Thanh Hà	t	0911134334	Hải Phòng	Thanh Tú Phạm	Thị trấn Thanh Hà	6
\.

-- 7. products
COPY public.products (id, created_at, updated_at, active, description, name, slug, brand_id, category_id) FROM stdin;
39	2026-04-18 07:46:31.10276	2026-04-18 07:46:31.102782	t	Laptop HP Omnibook X Flip 14-FK0092AU BZ7P5PA Ryzen AI 5 sở hữu bộ vi xử lý AMD Ryzen AI 5 340, đi cùng RAM 16GB giúp vận hành trơn tru mọi nhu cầu. Thiết bị sử dụng GPU AMD Radeon 840M, đáp ứng tốt yêu cầu về đồ họa cơ bản. Laptop HP này còn có hệ thống cổng giao tiếp phong phú linh hoạt trong nhiều tình huống.	Laptop HP Omnibook X Flip 14-FK0092AU BZ7P5PA	laptop-hp-omnibook-x-flip-14-fk0092au-bz7p5pa	8	4
4	2026-04-14 13:53:38.711632	2026-04-18 07:17:57.927658	t	Chip M3 siêu mạnh mẽ cho Pro	MacBook Pro 14 M3	laptop-macbook-pro-14-m3	1	4
22	2026-04-15 13:34:26.372014	2026-04-18 07:17:58.005454	t		MacBook Neo	laptop-macbook-neo	1	4
2	2026-04-14 13:53:38.608754	2026-04-18 07:32:48.971602	t	Flagship cao cấp nhất của Apple 2024	iPhone 15 Pro Max 256GB	dien-thoai-iphone-15-pro-max-256gb	1	2
3	2026-04-14 13:53:38.678166	2026-04-18 07:32:48.996011	t	Quyền năng Galaxy AI đỉnh cao	Samsung Galaxy S24 Ultra	dien-thoai-samsung-galaxy-s24-ultra	2	2
5	2026-04-14 13:53:38.744565	2026-04-18 07:36:45.160138	t	Laptop gaming mỏng nhẹ mạnh mẽ	Laptop ASUS ROG Zephyrus G14	laptop-asus-rog-zephyrus-g14	4	4
11	2026-04-14 13:53:38.908316	2026-04-18 07:36:45.178463	t	Định nghĩa lại thiết bị siêu gọn nhẹ	Laptop Dell XPS 13 Plus	laptop-dell-xps-13-plus	6	4
31	2026-04-16 13:47:57.012055	2026-04-18 07:36:45.183391	t	Sản phẩm Laptop ASUS TUF Gaming F16 FX607VJ-RL034W chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop ASUS TUF Gaming F16 FX607VJ-RL034W	laptop-asus-tuf-gaming-f16-fx607vj-rl034w	4	4
32	2026-04-16 13:47:57.042353	2026-04-18 07:36:45.187748	t	Sản phẩm Laptop Acer Gaming Nitro ProPanel ANV15-41-R7CR chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop Acer Gaming Nitro ProPanel ANV15-41-R7CR	laptop-acer-gaming-nitro-propanel-anv15-41-r7cr	16	4
33	2026-04-16 13:47:57.072699	2026-04-18 07:36:45.191708	t	Sản phẩm Laptop Lenovo LOQ 15ARP10E 83S0007AVN chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop Lenovo LOQ 15ARP10E 83S0007AVN	laptop-lenovo-loq-15arp10e-83s0007avn	17	4
34	2026-04-16 13:47:57.093891	2026-04-18 07:36:45.196923	t	Sản phẩm Laptop Acer Gaming Aspire 7 A715-59G-57TU chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop Acer Gaming Aspire 7 A715-59G-57TU	laptop-acer-gaming-aspire-7-a715-59g-57tu	16	4
36	2026-04-16 13:47:57.134848	2026-04-18 07:36:45.201589	t	Sản phẩm Laptop ASUS Vivobook S14 S3407QA-SF043WS chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop ASUS Vivobook S14 S3407QA-SF043WS	laptop-asus-vivobook-s14-s3407qa-sf043ws	4	4
37	2026-04-16 13:47:57.154755	2026-04-18 07:36:45.205745	t	Sản phẩm Laptop ASUS Vivobook 14 M1405NAQ-LY011W chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop ASUS Vivobook 14 M1405NAQ-LY011W	laptop-asus-vivobook-14-m1405naq-ly011w	4	4
38	2026-04-16 13:47:57.184481	2026-04-18 07:36:45.210537	t	Sản phẩm Laptop MSI Modern 14 F13MG-240VNCP chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Laptop MSI Modern 14 F13MG-240VNCP	laptop-msi-modern-14-f13mg-240vncp	18	4
1	2026-04-14 12:37:53.397263	2026-04-18 07:36:45.214573	t	San pham cao cap nhat cua Apple nam 2023	iPhone 15 Pro Max	dien-thoai-iphone-15-pro-max	1	3
6	2026-04-14 13:53:38.774222	2026-04-18 07:17:57.933255	t	Máy tính bảng mạnh mẽ nhất thế giới	iPad Pro M2 11 inch	tablet-ipad-pro-m2-11-inch	1	5
7	2026-04-14 13:53:38.807614	2026-04-18 07:17:57.938533	t	Chống ồn chủ động gấp 2 lần	AirPods Pro Gen 2 (MagSafe)	phu-kien-airpods-pro-gen-2-magsafe	1	6
9	2026-04-14 13:53:38.861549	2026-04-18 07:17:57.948278	t	Tai nghe chống ồn tốt nhất thế giới	Sony WH-1000XM5	phu-kien-sony-wh-1000xm5	5	6
10	2026-04-14 13:53:38.881201	2026-04-18 07:17:57.95319	t	Đồng hồ thông minh tiên tiến	Apple Watch Series 9	phu-kien-apple-watch-series-9	1	6
12	2026-04-14 13:53:38.927173	2026-04-18 07:17:57.957613	t	Màn hình lớn nhất, mỏng nhất	Samsung Galaxy Tab S9 Ultra	tablet-samsung-galaxy-tab-s9-ultra	2	5
14	2026-04-14 13:53:38.983949	2026-04-18 07:17:57.967421	t	Laptop xoay gập 2-trong-1 sang trọng	HP Spectre x360 14	laptop-hp-spectre-x360-14	8	4
15	2026-04-14 13:53:39.010449	2026-04-18 07:17:57.972973	t	Chuột làm việc tốt nhất cho Creator	Logitech MX Master 3S	phu-kien-logitech-mx-master-3s	9	6
16	2026-04-14 13:53:39.037712	2026-04-18 07:17:57.97759	t	Bàn phím cơ Custom cao cấp	Keyboard Keychron Q1 Pro	phu-kien-keyboard-keychron-q1-pro	10	6
17	2026-04-14 13:53:39.065608	2026-04-18 07:17:57.982838	t	Máy tính 2 trong 1 linh hoạt nhất	Microsoft Surface Pro 9	tablet-microsoft-surface-pro-9	11	5
18	2026-04-14 13:53:39.090951	2026-04-18 07:17:57.987586	t	Đồng hồ thể thao chuyên dụng	Garmin Fenix 7 Pro	phu-kien-garmin-fenix-7-pro	12	6
19	2026-04-14 13:53:39.110385	2026-04-18 07:17:57.992135	t	Màn hình OLED rực rỡ sắc màu	ASUS Vivobook S 15 OLED	laptop-asus-vivobook-s-15-oled	4	4
21	2026-04-14 13:53:39.173287	2026-04-18 07:17:58.00095	t	Sạc nhanh 140W cho laptop và đt	Sạc dự phòng Anker 737	phu-kien-sac-du-phong-anker-737	14	6
35	2026-04-16 13:47:57.114641	2026-04-18 07:17:58.048984	t	Sản phẩm MacBook Air M5 13 inch 2026 chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	MacBook Air M5 13 inch 2026	laptop-macbook-air-m5-13-inch-2026	1	4
8	2026-04-14 13:53:38.828908	2026-04-18 07:32:49.007331	t	Điện thoại gập mở tương lai	Samsung Galaxy Z Fold5	dien-thoai-samsung-galaxy-z-fold5	2	2
13	2026-04-14 13:53:38.955681	2026-04-18 07:32:49.014597	t	Camera Leica đỉnh cao nhiếp ảnh	Xiaomi 14 Ultra	dien-thoai-xiaomi-14-ultra	7	2
20	2026-04-14 13:53:39.142722	2026-04-18 07:32:49.020396	t	Điện thoại gập phong cách thời trang	Oppo Find N3 Flip	dien-thoai-oppo-find-n3-flip	13	2
23	2026-04-16 13:47:56.719506	2026-04-18 07:32:49.026196	t	Sản phẩm iPhone 17 Pro 256GB | Chính hãng chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	iPhone 17 Pro 256GB | Chính hãng	dien-thoai-iphone-17-pro-256gb-chinh-hang	1	2
24	2026-04-16 13:47:56.787684	2026-04-18 07:32:49.035323	t	Sản phẩm iPhone 17 Pro Max 256GB | Chính hãng chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	iPhone 17 Pro Max 256GB | Chính hãng	dien-thoai-iphone-17-pro-max-256gb-chinh-hang	1	2
25	2026-04-16 13:47:56.811519	2026-04-18 07:32:49.040295	t	Sản phẩm Samsung Galaxy S26 Ultra 12GB 256GB chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Samsung Galaxy S26 Ultra 12GB 256GB	dien-thoai-samsung-galaxy-s26-ultra-12gb-256gb	2	2
26	2026-04-16 13:47:56.836055	2026-04-18 07:32:49.045371	t	Sản phẩm iPhone 17 256GB | Chính hãng chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	iPhone 17 256GB | Chính hãng	dien-thoai-iphone-17-256gb-chinh-hang	1	2
27	2026-04-16 13:47:56.860872	2026-04-18 07:32:49.053162	t	Sản phẩm Samsung Galaxy S26 12GB 256GB chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Samsung Galaxy S26 12GB 256GB	dien-thoai-samsung-galaxy-s26-12gb-256gb	2	2
28	2026-04-16 13:47:56.88863	2026-04-18 07:32:49.060462	t	Sản phẩm Samsung Galaxy S25 Ultra 12GB 256GB chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Samsung Galaxy S25 Ultra 12GB 256GB	dien-thoai-samsung-galaxy-s25-ultra-12gb-256gb	2	2
29	2026-04-16 13:47:56.959083	2026-04-18 07:32:49.065185	t	Sản phẩm Samsung Galaxy Z Flip7 12GB 256GB chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Samsung Galaxy Z Flip7 12GB 256GB	dien-thoai-samsung-galaxy-z-flip7-12gb-256gb	2	2
30	2026-04-16 13:47:56.984337	2026-04-18 07:32:49.075662	t	Sản phẩm Xiaomi Redmi Note 14 Pro Plus 5G chính hãng, bảo hành 12 tháng tại đại lý Tech Store.	Xiaomi Redmi Note 14 Pro Plus 5G	dien-thoai-xiaomi-redmi-note-14-pro-plus-5g	7	2
\.

-- 8. product_variants
COPY public.product_variants (id, created_at, updated_at, active, color, name, price, size, sku, sort_order, stock_quantity, version, product_id, cost_price, original_price) FROM stdin;
29	2026-04-16 13:47:56.817163	2026-04-16 13:48:37.717122	t	\N	Samsung Galaxy S26 Ultra 12GB 256GB	31990000.00	\N	CPS-1002	\N	100	1	25	\N	\N
30	2026-04-16 13:47:56.841683	2026-04-16 13:49:54.212138	t	\N	iPhone 17 256GB | Chính hãng	24390000.00	\N	CPS-1003	\N	100	1	26	\N	\N
31	2026-04-16 13:47:56.867633	2026-04-16 13:50:13.925212	t	\N	Samsung Galaxy S26 12GB 256GB	20990000.00	\N	CPS-1004	\N	100	1	27	\N	\N
32	2026-04-16 13:47:56.893115	2026-04-16 13:50:31.907343	t	\N	Samsung Galaxy S25 Ultra 12GB 256GB	27490000.00	\N	CPS-1005	\N	100	1	28	\N	\N
33	2026-04-16 13:47:56.964298	2026-04-16 13:51:12.20211	t	\N	Samsung Galaxy Z Flip7 12GB 256GB	23990000.00	\N	CPS-1007	\N	100	1	29	\N	\N
2	2026-04-14 12:37:53.414573	2026-04-15 13:15:18.537542	t	Natural	512GB - Natural Titanium	36000000.00	512GB	IP15PM-512-NATURAL	1	19	3	1	\N	\N
1	2026-04-14 12:37:53.409767	2026-04-15 13:36:17.705092	t		256GB - Blue Titanium	32000000.00		IP15PM-256-BLUE	0	50	3	1	\N	\N
34	2026-04-16 13:47:56.98963	2026-04-16 13:51:47.482886	t	\N	Xiaomi Redmi Note 14 Pro Plus 5G	8490000.00	\N	CPS-1008	\N	100	1	30	\N	\N
35	2026-04-16 13:47:57.017942	2026-04-16 13:55:26.475413	t	\N	Laptop ASUS TUF Gaming F16 FX607VJ-RL034W	22490000.00	\N	CPS-1009	\N	100	1	31	\N	\N
12	2026-04-14 13:53:38.911097	2026-04-16 14:00:18.04999	t	\N	Laptop Dell XPS 13 Plus	42000000.00	\N	XPS13-9320	\N	12	2	11	\N	\N
8	2026-04-14 13:53:38.811224	2026-04-15 13:49:18.963638	t		AirPods Pro Gen 2 (MagSafe)	5990000.00		APP2-USB-C	0	100	1	7	\N	\N
36	2026-04-16 13:47:57.046432	2026-04-16 14:02:34.764673	t	\N	Laptop Acer Gaming Nitro ProPanel ANV15-41-R7CR	28990000.00	\N	CPS-1010	\N	100	1	32	\N	\N
11	2026-04-14 13:53:38.884787	2026-04-15 13:50:59.34482	t		Apple Watch Series 9	10500000.00		AW9-41-ALU	0	60	1	10	\N	\N
13	2026-04-14 13:53:38.931697	2026-04-15 13:51:23.375782	t		Samsung Galaxy Tab S9 Ultra	25900000.00		S9U-256-GRY	0	15	1	12	\N	\N
14	2026-04-14 13:53:38.958561	2026-04-15 13:51:50.599808	t		Xiaomi 14 Ultra	28500000.00		XI14U-512-WHT	0	25	1	13	\N	\N
15	2026-04-14 13:53:38.987293	2026-04-15 14:04:48.067543	t		HP Spectre x360 14	38500000.00		HP-X360-14	0	8	1	14	\N	\N
16	2026-04-14 13:53:39.013899	2026-04-15 14:05:55.930964	t		Logitech MX Master 3S	2250000.00		MXM3S-GRY	0	150	1	15	\N	\N
17	2026-04-14 13:53:39.04063	2026-04-15 14:07:33.214151	t		Keyboard Keychron Q1 Pro	4200000.00		Q1PRO-ALU	0	35	1	16	\N	\N
38	2026-04-16 13:47:57.097575	2026-04-16 14:03:30.348349	t	\N	Laptop Acer Gaming Aspire 7 A715-59G-57TU	21990000.00	\N	CPS-1012	\N	100	1	34	\N	\N
19	2026-04-14 13:53:39.094016	2026-04-15 14:08:39.824437	t		Garmin Fenix 7 Pro	19500000.00		FENIX7P-BLK	0	15	1	18	\N	\N
20	2026-04-14 13:53:39.1146	2026-04-15 14:08:54.38855	t		ASUS Vivobook S 15 OLED	18900000.00		VBS15-OLED	0	40	1	19	\N	\N
39	2026-04-16 13:47:57.12036	2026-04-16 14:03:50.649413	t	\N	MacBook Air M5 13 inch 2026	29490000.00	\N	CPS-1013	\N	100	1	35	\N	\N
40	2026-04-16 13:47:57.139424	2026-04-16 14:04:12.120305	t	\N	Laptop ASUS Vivobook S14 S3407QA-SF043WS	23390000.00	\N	CPS-1014	\N	100	1	36	\N	\N
41	2026-04-16 13:47:57.159072	2026-04-16 14:04:24.1424	t	\N	Laptop ASUS Vivobook 14 M1405NAQ-LY011W	18790000.00	\N	CPS-1015	\N	100	1	37	\N	\N
21	2026-04-14 13:53:39.14658	2026-04-15 15:58:37.965191	t		Oppo Find N3 Flip	19990000.00		N3FLIP-GLD	0	28	2	20	\N	\N
42	2026-04-16 13:47:57.189364	2026-04-16 14:04:48.642281	t	\N	Laptop MSI Modern 14 F13MG-240VNCP	16790000.00	\N	CPS-1016	\N	100	1	38	\N	\N
18	2026-04-14 13:53:39.068838	2026-04-16 14:34:20.197091	t		Microsoft Surface Pro 9	24000000.00		SFPRO9-I5-82400000	0	17	3	17	\N	\N
9	2026-04-14 13:53:38.832276	2026-04-16 05:42:50.031623	t		Samsung Galaxy Z Fold5	29990000.00		ZFOLD5-256-BLU	0	12	3	8	\N	\N
22	2026-04-14 13:53:39.178303	2026-04-16 11:27:24.506879	t	\N	Sạc dự phòng Anker 737	3200000.00	\N	ANK737-140W	\N	79	3	21	\N	\N
27	2026-04-16 13:47:56.751009	2026-04-16 13:47:56.751073	t	Default	iPhone 17 Pro 256GB | Chính hãng	34790000.00	Mới 100%	CPS-1000	0	100	0	23	\N	\N
28	2026-04-16 13:47:56.791956	2026-04-16 13:47:56.792066	t	Default	iPhone 17 Pro Max 256GB | Chính hãng	36990000.00	Mới 100%	CPS-1001	0	100	0	24	\N	\N
10	2026-04-14 13:53:38.864913	2026-04-17 02:54:05.175856	t		Sony WH-1000XM5	7500000.00		WHXM5-BLK	0	38	3	9	\N	\N
37	2026-04-16 13:47:57.077398	2026-04-17 04:04:24.424128	t	\N	Laptop Lenovo LOQ 15ARP10E 83S0007AVN	28990000.00	\N	CPS-1011	\N	99	2	33	\N	\N
7	2026-04-14 13:53:38.778107	2026-04-17 07:09:40.014411	t	\N	iPad Pro M2 11 inch	21500000.00	\N	IPADP-M2-128	\N	30	2	6	\N	\N
4	2026-04-14 13:53:38.681649	2026-04-18 05:45:37.988283	t		Samsung Galaxy S24 Ultra	31990000.00		S24U-512-GRY	0	36	9	3	\N	\N
6	2026-04-14 13:53:38.747716	2026-04-19 10:27:48.280573	t	\N	Laptop ASUS ROG Zephyrus G14	45000000.00	\N	ROG-G14-2024	\N	14	8	5	\N	\N
43	2026-04-18 07:46:31.239179	2026-04-20 10:24:27.479054	t	\N	Laptop HP Omnibook X Flip 14-FK0092AU BZ7P5PA	29690000.00	\N	HP-AR17UZ	\N	99	2	39	\N	33000000.00
26	2026-04-15 13:34:26.391605	2026-04-20 20:48:17.476695	t		MacBook Neo	15990000.00		macbook-neo-default	0	13	4	22	\N	\N
3	2026-04-14 13:53:38.637155	2026-04-20 20:49:57.404394	t	\N	iPhone 15 Pro Max 256GB	34990000.00	\N	IP15PM-256-BLK	\N	45	5	2	\N	\N
5	2026-04-14 13:53:38.716706	2026-04-21 13:50:03.8888	t	\N	MacBook Pro 14 M3	39990000.00	\N	MBPM3-14-SLV	\N	28	12	4	40000000.00	42000000.00
\.

-- 9. orders
COPY public.orders (id, created_at, updated_at, discount_amount, idempotency_key, note, receiver_name, receiver_phone, shipping_address, shipping_fee, status, sub_total, total_amount, coupon_id, user_id) FROM stdin;
43	2026-04-16 05:42:50.026672	2026-04-16 06:31:48.291279	0.00	ord_1776318169985_j4x2j1ln7		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	DELIVERED	119960000.00	119990000.00	\N	6
38	2026-04-16 02:59:26.861049	2026-04-16 03:02:44.712518	0.00	ord_1776308366797_uiq14tvns		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	DELIVERED	31990000.00	32020000.00	\N	6
39	2026-04-16 03:11:33.845747	2026-04-16 03:11:46.981797	0.00	ord_1776309093734_yb6y3i4q3		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	DELIVERED	45000000.00	45030000.00	\N	6
45	2026-04-16 11:47:14.651205	2026-04-16 11:47:36.749002	0.00	ord_1776340034482_nd1urhkom		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	30000.00	DELIVERED	55990000.00	56020000.00	\N	6
40	2026-04-16 03:28:57.974926	2026-04-16 03:30:18.311199	0.00	ord_1776310137840_vw9ec0o7t		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	DELIVERED	52500000.00	52530000.00	\N	6
41	2026-04-16 03:42:12.606226	2026-04-16 03:42:59.665248	0.00	ord_1776310932354_8at46a3qj		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	CANCELLED	39990000.00	40020000.00	\N	6
42	2026-04-16 05:42:47.934366	2026-04-16 05:44:13.587143	0.00	ord_1776318167856_x40puukts		Phạm Tú	0988345675	Khu 5, Thị Trấn Thanh Hà, Thanh Hà, Hải Dương	30000.00	DELIVERED	119960000.00	119990000.00	\N	6
48	2026-04-17 02:54:05.203827	2026-04-17 03:00:29.691605	0.00	ord_1776394445062_ob57ukank		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	30000.00	REVIEWED	124480000.00	124510000.00	\N	6
57	2026-04-20 10:25:39.217815	2026-04-20 10:26:03.673604	0.00	ord_1776680739863_yua2jk931		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	0.00	DELIVERED	15990000.00	15990000.00	\N	6
52	2026-04-18 05:45:37.95721	2026-04-18 05:47:55.92995	0.00	ord_1776491137132_m11ckhlaw		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	30000.00	DELIVERED	31990000.00	32020000.00	\N	6
51	2026-04-17 09:50:48.581142	2026-04-18 05:52:41.903606	0.00	ord_1776419447940_nlqagub3e		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	30000.00	DELIVERED	34990000.00	35020000.00	\N	6
50	2026-04-17 06:55:49.273913	2026-04-18 05:54:44.645867	0.00	ord_1776408948489_r0xnw6k4o		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	30000.00	DELIVERED	31990000.00	32020000.00	\N	6
58	2026-04-20 20:48:17.459772	2026-04-20 20:48:42.665132	0.00	ord_1776692897895_t0v9kbj28		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	0.00	DELIVERED	15990000.00	15990000.00	\N	6
59	2026-04-20 20:49:57.390621	2026-04-20 20:50:17.739258	0.00	ord_1776692998053_lryfkc7cc		Thanh Tú Phạm	0911134334	Khu 7, Thị trấn Thanh Hà, Thanh Hà, Hải Phòng	0.00	DELIVERED	104970000.00	104970000.00	\N	6
\.

-- 10. order_items
COPY public.order_items (id, created_at, updated_at, image_url, price_at_purchase, quantity, variant_name, variant_sku, order_id, variant_id) FROM stdin;
40	2026-04-16 02:59:26.865362	2026-04-16 02:59:26.865391	http://res.cloudinary.com/dssehge7q/image/upload/v1776260871/techstore/products/l3ymef0xrv0mivelkzkv.webp	31990000.00	1	Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra	S24U-512-GRY	38	4
41	2026-04-16 03:11:33.851668	2026-04-16 03:11:33.851725	http://res.cloudinary.com/dssehge7q/image/upload/v1776260931/techstore/products/mrl1lua06z8quoya9cjw.webp	45000000.00	1	Laptop ASUS ROG Zephyrus G14 - Laptop ASUS ROG Zephyrus G14	ROG-G14-2024	39	6
42	2026-04-16 03:28:57.978182	2026-04-16 03:28:57.978266	http://res.cloudinary.com/dssehge7q/image/upload/v1776260931/techstore/products/mrl1lua06z8quoya9cjw.webp	45000000.00	1	Laptop ASUS ROG Zephyrus G14 - Laptop ASUS ROG Zephyrus G14	ROG-G14-2024	40	6
43	2026-04-16 03:28:57.981218	2026-04-16 03:28:57.981247	http://res.cloudinary.com/dssehge7q/image/upload/v1776261045/techstore/products/rnywkodlpfrjrtzliibx.webp	7500000.00	1	Sony WH-1000XM5 - Sony WH-1000XM5	WHXM5-BLK	40	10
44	2026-04-16 03:42:12.61603	2026-04-16 03:42:12.616093	http://res.cloudinary.com/dssehge7q/image/upload/v1776260915/techstore/products/q8cq6am1zi9ekamdp8y1.webp	39990000.00	1	MacBook Pro 14 M3 - MacBook Pro 14 M3	MBPM3-14-SLV	41	5
45	2026-04-16 05:42:47.938635	2026-04-16 05:42:47.938664	http://res.cloudinary.com/dssehge7q/image/upload/v1776261012/techstore/products/crb3qtnzxrtmqap3akbe.webp	29990000.00	4	Samsung Galaxy Z Fold5 - Samsung Galaxy Z Fold5	ZFOLD5-256-BLU	42	9
46	2026-04-16 05:42:50.028803	2026-04-16 05:42:50.02883	http://res.cloudinary.com/dssehge7q/image/upload/v1776261012/techstore/products/crb3qtnzxrtmqap3akbe.webp	29990000.00	4	Samsung Galaxy Z Fold5 - Samsung Galaxy Z Fold5	ZFOLD5-256-BLU	43	9
48	2026-04-16 11:47:14.662334	2026-04-16 11:47:14.662427	http://res.cloudinary.com/dssehge7q/image/upload/v1776260871/techstore/products/l3ymef0xrv0mivelkzkv.webp	31990000.00	1	Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra	S24U-512-GRY	45	4
49	2026-04-16 11:47:14.666643	2026-04-16 11:47:14.666676	http://res.cloudinary.com/dssehge7q/image/upload/v1776262102/techstore/products/otuirye4zyfdvlpzt7bn.webp	24000000.00	1	Microsoft Surface Pro 9 - Microsoft Surface Pro 9	SFPRO9-I5-82400000	45	18
55	2026-04-17 02:54:05.208335	2026-04-17 02:54:05.208379	http://res.cloudinary.com/dssehge7q/image/upload/v1776260931/techstore/products/mrl1lua06z8quoya9cjw.webp	45000000.00	1	Laptop ASUS ROG Zephyrus G14 - Laptop ASUS ROG Zephyrus G14	ROG-G14-2024	48	6
56	2026-04-17 02:54:05.216482	2026-04-17 02:54:05.216513	http://res.cloudinary.com/dssehge7q/image/upload/v1776261045/techstore/products/rnywkodlpfrjrtzliibx.webp	7500000.00	1	Sony WH-1000XM5 - Sony WH-1000XM5	WHXM5-BLK	48	10
57	2026-04-17 02:54:05.218753	2026-04-17 02:54:05.218796	http://res.cloudinary.com/dssehge7q/image/upload/v1776305816/techstore/products/ykpaxjb69xvh4jkg6alm.webp	31990000.00	1	Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra	S24U-512-GRY	48	4
58	2026-04-17 02:54:05.22089	2026-04-17 02:54:05.22092	http://res.cloudinary.com/dssehge7q/image/upload/v1776260915/techstore/products/q8cq6am1zi9ekamdp8y1.webp	39990000.00	1	MacBook Pro 14 M3 - MacBook Pro 14 M3	MBPM3-14-SLV	48	5
60	2026-04-17 06:55:49.280459	2026-04-17 06:55:49.280489	http://res.cloudinary.com/dssehge7q/image/upload/v1776305816/techstore/products/ykpaxjb69xvh4jkg6alm.webp	31990000.00	1	Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra	S24U-512-GRY	50	4
61	2026-04-17 09:50:48.61416	2026-04-17 09:50:48.614175	http://res.cloudinary.com/dssehge7q/image/upload/v1776259180/techstore/products/jiep9mczalyftwelhjiy.webp	34990000.00	1	iPhone 15 Pro Max 256GB - iPhone 15 Pro Max 256GB	IP15PM-256-BLK	51	3
62	2026-04-18 05:45:37.963514	2026-04-18 05:45:37.963534	http://res.cloudinary.com/dssehge7q/image/upload/v1776260871/techstore/products/l3ymef0xrv0mivelkzkv.webp	31990000.00	1	Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra	S24U-512-GRY	52	4
68	2026-04-20 10:25:39.222003	2026-04-20 10:25:39.222028	http://res.cloudinary.com/dssehge7q/image/upload/v1776260065/techstore/products/muapfi1qd7c6ojjdgjzm.webp	15990000.00	1	MacBook Neo	macbook-neo-default	57	26
69	2026-04-20 20:48:17.465848	2026-04-20 20:48:17.465885	http://res.cloudinary.com/dssehge7q/image/upload/v1776260049/techstore/products/q8avy4jrjzzeq4ufbeyl.webp	15990000.00	1	MacBook Neo	macbook-neo-default	58	26
70	2026-04-20 20:49:57.396894	2026-04-20 20:49:57.39692	http://res.cloudinary.com/dssehge7q/image/upload/v1776607921/techstore/products/il9cmw19rblql2fwqvu9.webp	34990000.00	3	iPhone 15 Pro Max 256GB	IP15PM-256-BLK	59	3
\.

-- 11. product_images
COPY public.product_images (id, created_at, updated_at, image_url, is_thumbnail, product_id) FROM stdin;
24	2026-04-15 13:49:50.40021	2026-04-15 13:49:50.40023	http://res.cloudinary.com/dssehge7q/image/upload/v1776260989/techstore/products/stwqyrsy2f1kij6synhv.webp	t	7
25	2026-04-15 13:50:13.758612	2026-04-15 13:50:13.75863	http://res.cloudinary.com/dssehge7q/image/upload/v1776261012/techstore/products/crb3qtnzxrtmqap3akbe.webp	t	8
26	2026-04-15 13:50:46.962581	2026-04-15 13:50:46.962606	http://res.cloudinary.com/dssehge7q/image/upload/v1776261045/techstore/products/rnywkodlpfrjrtzliibx.webp	t	9
27	2026-04-15 13:50:59.341288	2026-04-15 13:50:59.341326	http://res.cloudinary.com/dssehge7q/image/upload/v1776261057/techstore/products/j93s05rhu1k0jqfsdvcs.webp	t	10
29	2026-04-15 13:51:23.372016	2026-04-15 13:51:23.372033	http://res.cloudinary.com/dssehge7q/image/upload/v1776261081/techstore/products/lwadrefrrkjxi3rwygxx.webp	t	12
30	2026-04-15 13:51:50.596559	2026-04-15 13:51:50.596605	http://res.cloudinary.com/dssehge7q/image/upload/v1776261109/techstore/products/lhiho9xgkkeb4r5efxpk.webp	t	13
31	2026-04-15 14:04:48.009767	2026-04-15 14:04:48.009879	http://res.cloudinary.com/dssehge7q/image/upload/v1776261886/techstore/products/c96yljiornfxvpqqxumu.webp	t	14
32	2026-04-15 14:05:55.923354	2026-04-15 14:05:55.923391	http://res.cloudinary.com/dssehge7q/image/upload/v1776261954/techstore/products/ibgvqdhq6tse1kxmhxe2.webp	t	15
33	2026-04-15 14:07:33.206276	2026-04-15 14:07:33.206319	http://res.cloudinary.com/dssehge7q/image/upload/v1776262051/techstore/products/n94zzclhrudiduvjqqb8.webp	t	16
34	2026-04-15 14:08:25.366404	2026-04-15 14:08:25.366439	http://res.cloudinary.com/dssehge7q/image/upload/v1776262102/techstore/products/otuirye4zyfdvlpzt7bn.webp	t	17
35	2026-04-15 14:08:39.819757	2026-04-15 14:08:39.819915	http://res.cloudinary.com/dssehge7q/image/upload/v1776262118/techstore/products/jtamnrqvadd7e94vergd.webp	t	18
36	2026-04-15 14:08:54.384143	2026-04-15 14:08:54.384192	http://res.cloudinary.com/dssehge7q/image/upload/v1776262133/techstore/products/pa6kr5pgkuv040khgzqu.webp	t	19
37	2026-04-15 14:09:04.869364	2026-04-15 14:09:04.869412	http://res.cloudinary.com/dssehge7q/image/upload/v1776262144/techstore/products/uhi1ruq5i0keqxvyxaby.webp	t	20
38	2026-04-15 14:09:55.563685	2026-04-15 14:09:55.56372	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200	t	1
39	2026-04-15 14:09:59.209417	2026-04-15 14:09:59.209444	http://res.cloudinary.com/dssehge7q/image/upload/v1776260065/techstore/products/muapfi1qd7c6ojjdgjzm.webp	f	22
40	2026-04-15 14:09:59.212704	2026-04-15 14:09:59.212737	http://res.cloudinary.com/dssehge7q/image/upload/v1776260049/techstore/products/q8avy4jrjzzeq4ufbeyl.webp	t	22
41	2026-04-15 14:09:59.21593	2026-04-15 14:09:59.216025	http://res.cloudinary.com/dssehge7q/image/upload/v1776260058/techstore/products/nux6cqlfgcih08fi1xrd.webp	f	22
42	2026-04-15 14:09:59.219803	2026-04-15 14:09:59.219834	http://res.cloudinary.com/dssehge7q/image/upload/v1776260058/techstore/products/dxpdn9zxeenzus2r324k.webp	f	22
81	2026-04-16 02:16:57.248514	2026-04-16 02:16:57.248603	http://res.cloudinary.com/dssehge7q/image/upload/v1776305816/techstore/products/ykpaxjb69xvh4jkg6alm.webp	f	3
82	2026-04-16 02:16:57.25427	2026-04-16 02:16:57.254314	http://res.cloudinary.com/dssehge7q/image/upload/v1776260871/techstore/products/l3ymef0xrv0mivelkzkv.webp	t	3
83	2026-04-16 05:40:11.606984	2026-04-16 05:40:11.607078	http://res.cloudinary.com/dssehge7q/image/upload/v1776260931/techstore/products/mrl1lua06z8quoya9cjw.webp	t	5
84	2026-04-16 08:42:24.740198	2026-04-16 08:42:24.740254	http://res.cloudinary.com/dssehge7q/image/upload/v1776328943/techstore/products/ic8yducu0ntsrwzetq1w.webp	t	21
85	2026-04-16 13:47:56.745607	2026-04-16 13:47:56.745742	https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-17-pro.png	t	23
86	2026-04-16 13:47:56.789872	2026-04-16 13:47:56.789902	https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-17-pro-max.png	t	24
101	2026-04-16 13:48:37.699964	2026-04-16 13:48:37.69999	http://res.cloudinary.com/dssehge7q/image/upload/v1776347305/techstore/products/xwsfc3sr2t8hm9zjp0sd.webp	t	25
102	2026-04-16 13:49:54.204806	2026-04-16 13:49:54.204843	http://res.cloudinary.com/dssehge7q/image/upload/v1776347391/techstore/products/kilyxn6lskj4yxfnvz00.webp	t	26
103	2026-04-16 13:50:13.921302	2026-04-16 13:50:13.921322	http://res.cloudinary.com/dssehge7q/image/upload/v1776347410/techstore/products/oopqor6sodqqy2vrof4w.webp	t	27
104	2026-04-16 13:50:31.901424	2026-04-16 13:50:31.901508	http://res.cloudinary.com/dssehge7q/image/upload/v1776347428/techstore/products/bldktth956xvys2vthen.webp	t	28
105	2026-04-16 13:51:12.194822	2026-04-16 13:51:12.194863	http://res.cloudinary.com/dssehge7q/image/upload/v1776347469/techstore/products/xqjgmzlqywd74agrrqxm.webp	t	29
106	2026-04-16 13:51:47.476378	2026-04-16 13:51:47.476405	http://res.cloudinary.com/dssehge7q/image/upload/v1776347505/techstore/products/mnsuqwkhdhvtl1crsgnh.webp	t	30
107	2026-04-16 13:55:26.469634	2026-04-16 13:55:26.469655	http://res.cloudinary.com/dssehge7q/image/upload/v1776347723/techstore/products/fgbk9bd9xodxepy9ymzq.webp	t	31
108	2026-04-16 14:00:17.973819	2026-04-16 14:00:17.973961	http://res.cloudinary.com/dssehge7q/image/upload/v1776261069/techstore/products/pjh44w6qxwx0gezxazk8.webp	t	11
109	2026-04-16 14:00:18.015847	2026-04-16 14:00:18.015958	http://res.cloudinary.com/dssehge7q/image/upload/v1776348015/techstore/products/ocf4drwupdjvpgjfda3m.webp	f	11
110	2026-04-16 14:02:34.709132	2026-04-16 14:02:34.709246	http://res.cloudinary.com/dssehge7q/image/upload/v1776348137/techstore/products/qj5ua9apsidpag1rgtpz.webp	t	32
111	2026-04-16 14:02:34.741559	2026-04-16 14:02:34.741607	http://res.cloudinary.com/dssehge7q/image/upload/v1776348148/techstore/products/tkbjjpiugi8irsymmcfr.webp	f	32
112	2026-04-16 14:02:47.284928	2026-04-16 14:02:47.285005	http://res.cloudinary.com/dssehge7q/image/upload/v1776348164/techstore/products/x5zfqaythf2mwbycvvsu.webp	t	33
113	2026-04-16 14:03:30.345448	2026-04-16 14:03:30.345484	http://res.cloudinary.com/dssehge7q/image/upload/v1776348184/techstore/products/nrhhogepef5nojp9eyci.webp	t	34
114	2026-04-16 14:03:50.645846	2026-04-16 14:03:50.645902	http://res.cloudinary.com/dssehge7q/image/upload/v1776348228/techstore/products/q4ixygeql2am2jro43p4.webp	t	35
115	2026-04-16 14:04:12.117265	2026-04-16 14:04:12.117296	http://res.cloudinary.com/dssehge7q/image/upload/v1776348247/techstore/products/t0haynmp0xkzvkkbm5av.webp	t	36
116	2026-04-16 14:04:24.134971	2026-04-16 14:04:24.135	http://res.cloudinary.com/dssehge7q/image/upload/v1776348261/techstore/products/qxsfdep3vmw9z79fig58.webp	t	37
117	2026-04-16 14:04:48.63734	2026-04-16 14:04:48.637372	http://res.cloudinary.com/dssehge7q/image/upload/v1776348286/techstore/products/l8xfbelu0zbyoqxgljky.webp	t	38
129	2026-04-17 07:09:40.006704	2026-04-17 07:09:40.006727	http://res.cloudinary.com/dssehge7q/image/upload/v1776409778/techstore/products/nhvf9lm4j78nx3redxkm.webp	f	6
130	2026-04-17 07:09:40.008679	2026-04-17 07:09:40.008739	http://res.cloudinary.com/dssehge7q/image/upload/v1776260948/techstore/products/hki11erzt2cnkb2b1enz.webp	t	6
147	2026-04-19 14:12:03.554179	2026-04-19 14:12:03.554231	http://res.cloudinary.com/dssehge7q/image/upload/v1776259180/techstore/products/jiep9mczalyftwelhjiy.webp	f	2
148	2026-04-19 14:12:03.572048	2026-04-19 14:12:03.572074	http://res.cloudinary.com/dssehge7q/image/upload/v1776274147/techstore/products/eoxdvodcquj86n9rowtx.webp	f	2
149	2026-04-19 14:12:03.57692	2026-04-19 14:12:03.576967	http://res.cloudinary.com/dssehge7q/image/upload/v1776274160/techstore/products/ygblfjqn0dja3azg7r9s.webp	f	2
150	2026-04-19 14:12:03.581301	2026-04-19 14:12:03.581324	http://res.cloudinary.com/dssehge7q/image/upload/v1776607921/techstore/products/il9cmw19rblql2fwqvu9.webp	f	2
151	2026-04-19 14:12:03.587992	2026-04-19 14:12:03.588012	http://res.cloudinary.com/dssehge7q/image/upload/v1776259189/techstore/products/ponxdv80koaqpktyao6y.webp	f	2
152	2026-04-19 14:12:03.597383	2026-04-19 14:12:03.59741	http://res.cloudinary.com/dssehge7q/image/upload/v1776267909/techstore/products/hvu9hzoeslkdphyqeyhc.webp	f	2
153	2026-04-19 14:12:03.611615	2026-04-19 14:12:03.611632	http://res.cloudinary.com/dssehge7q/image/upload/v1776259196/techstore/products/lqs2ijvyuuksq3jjyqtu.webp	f	2
154	2026-04-19 14:12:03.619624	2026-04-19 14:12:03.61964	http://res.cloudinary.com/dssehge7q/image/upload/v1776259171/techstore/products/igpad1p1jcqaretocm2b.webp	t	2
182	2026-04-20 10:24:27.333048	2026-04-20 10:24:27.333113	https://res.cloudinary.com/dssehge7q/image/upload/v1776498343/techstore/products/y4apeinfs6dsgqeil48d.webp	f	39
183	2026-04-20 10:24:27.338238	2026-04-20 10:24:27.338305	https://res.cloudinary.com/dssehge7q/image/upload/v1776498280/techstore/products/po8ucato2p7x7tygxrf4.webp	t	39
184	2026-04-20 10:24:27.342121	2026-04-20 10:24:27.342149	https://res.cloudinary.com/dssehge7q/image/upload/v1776498324/techstore/products/dodv3hutqkctiibhkm33.webp	f	39
185	2026-04-20 10:24:27.347819	2026-04-20 10:24:27.347846	https://res.cloudinary.com/dssehge7q/image/upload/v1776498354/techstore/products/yyxzygzk78vc38g1rymz.webp	f	39
186	2026-04-20 10:24:27.36752	2026-04-20 10:24:27.367551	https://res.cloudinary.com/dssehge7q/image/upload/v1776498338/techstore/products/hangrx1jzefjcr0x0l4a.webp	f	39
187	2026-04-20 10:24:27.428487	2026-04-20 10:24:27.428523	https://res.cloudinary.com/dssehge7q/image/upload/v1776498349/techstore/products/ms9ptnqc5dhdamsyqvyv.webp	f	39
188	2026-04-20 10:24:27.444125	2026-04-20 10:24:27.444153	https://res.cloudinary.com/dssehge7q/image/upload/v1776498359/techstore/products/kdimyf0d6xz6y8kmtggu.webp	f	39
189	2026-04-20 10:24:27.453121	2026-04-20 10:24:27.45315	https://res.cloudinary.com/dssehge7q/image/upload/v1776498367/techstore/products/suyxnc7dur3klmnkxeov.webp	f	39
190	2026-04-20 10:24:27.460964	2026-04-20 10:24:27.460991	https://res.cloudinary.com/dssehge7q/image/upload/v1776498318/techstore/products/jmpljqe63qpxqpxysnoc.webp	f	39
191	2026-04-20 12:15:43.133537	2026-04-20 12:15:43.133632	https://res.cloudinary.com/dssehge7q/image/upload/v1776260915/techstore/products/q8cq6am1zi9ekamdp8y1.webp	t	4
192	2026-04-20 12:15:43.143885	2026-04-20 12:15:43.143908	https://res.cloudinary.com/dssehge7q/image/upload/v1776409663/techstore/products/a6lhg3mm7ewxrotdw0rf.webp	f	4
\.

-- 12. product_attributes
COPY public.product_attributes (id, created_at, updated_at, attribute_name, attribute_value, product_id) FROM stdin;
12	2026-04-15 14:09:55.557187	2026-04-15 14:09:55.557211	RAM	8GB	1
13	2026-04-15 14:09:55.560246	2026-04-15 14:09:55.560285	Chipset	A17 Pro	1
14	2026-04-15 14:09:59.205715	2026-04-15 14:09:59.205753	Bộ nhớ	256GB	22
59	2026-04-20 10:24:27.182094	2026-04-20 10:24:27.182202	Loại RAM	LPDDR5x-7500 MT/s (onboard)	39
60	2026-04-20 10:24:27.206212	2026-04-20 10:24:27.206245	Pin	3 Cell Int (59.16Wh)	39
61	2026-04-20 10:24:27.224049	2026-04-20 10:24:27.224087	Loại card đồ họa	AMD Radeon 840M Graphics	39
62	2026-04-20 10:24:27.230785	2026-04-20 10:24:27.230817	Dung lượng RAM	16GB	39
63	2026-04-20 10:24:27.238165	2026-04-20 10:24:27.238196	Loại CPU	AMD Ryzen AI 5 340 (6 x 2.00 GHz) - Max. Boost Clock: Up to 4.80 GHz	39
64	2026-04-20 10:24:27.257219	2026-04-20 10:24:27.257462	Độ phân giải màn hình	1920 x 1200 pixels (WUXGA)	39
65	2026-04-20 10:24:27.27018	2026-04-20 10:24:27.270213	Công nghệ màn hình	Kính tràn viền Viền mỏng micro-edge Hỗ trợ bút stylus	39
66	2026-04-20 10:24:27.279342	2026-04-20 10:24:27.279381	Cổng giao tiếp	2 x USB 3.2 Gen 2 Type-A 1 x USB Type-C tối đa 10Gbps, hỗ trợ Power Delivery, DisplayPort, HP Sleep and Charge 1 x USB Type-C tối đa 40Gbps, hỗ trợ Power Delivery, DisplayPort, HP Sleep and Charge 1 x HDMI 1 x Jack tai nghe / micrô combo	39
67	2026-04-20 10:24:27.289355	2026-04-20 10:24:27.289387	Hệ điều hành	Windows 11 Home Single Language 64-bit + Office Home 2024	39
68	2026-04-20 10:24:27.303735	2026-04-20 10:24:27.30377	Kích thước màn hình	14 inches	39
69	2026-04-20 10:24:27.322104	2026-04-20 10:24:27.322142	Ổ cứng	512GB SSD PCIe (M.2 2280)	39
\.

-- 13. reviews
COPY public.reviews (id, created_at, updated_at, comment, helpful_count, is_verified_purchase, rating, reply_comment, reply_date, product_id, user_id) FROM stdin;
3	2026-04-16 11:48:00.541693	2026-04-16 11:48:00.542758		0	t	5	\N	\N	17	6
4	2026-04-16 11:48:29.486853	2026-04-16 11:48:40.275376		0	t	5	\N	\N	5	6
5	2026-04-16 11:48:43.432418	2026-04-16 11:48:43.432462		0	t	5	\N	\N	9	6
2	2026-04-16 11:47:57.695838	2026-04-16 11:48:54.918827		0	t	5	\N	\N	3	6
1	2026-04-16 03:15:02.212792	2026-04-17 03:00:42.104367		0	t	5	\N	\N	4	6
6	2026-04-20 20:47:31.350628	2026-04-20 20:47:31.350672	tôt\n	0	t	5	\N	\N	22	6
\.

-- 14. notifications
COPY public.notifications (id, created_at, updated_at, is_read, message, title, user_id) FROM stdin;
34	2026-04-16 12:42:08.727983	2026-04-16 12:47:57.121736	t	Đã cập nhật số lượng Microsoft Surface Pro 9 - Microsoft Surface Pro 9 trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
33	2026-04-16 12:41:46.645195	2026-04-16 12:47:57.12591	t	Đã thêm Microsoft Surface Pro 9 - Microsoft Surface Pro 9 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
32	2026-04-16 12:41:35.581064	2026-04-16 12:47:57.127744	t	Đã cập nhật số lượng MacBook Neo - MacBook Neo trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
7	2026-04-15 17:00:45.664722	2026-04-15 17:00:45.664754	f	gửi thông báo\n\n	[PROMOTION] cửa hàng techzone	4
31	2026-04-16 12:41:31.990115	2026-04-16 12:47:57.129573	t	Đã cập nhật số lượng MacBook Neo - MacBook Neo trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
30	2026-04-16 12:41:30.182855	2026-04-16 12:47:57.131347	t	Đã thêm MacBook Neo - MacBook Neo (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
35	2026-04-16 12:56:54.360217	2026-04-16 13:28:27.403729	t	Đã thêm Samsung Galaxy S24 Ultra - Samsung Galaxy S24 Ultra (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
38	2026-04-16 14:32:54.306348	2026-04-16 14:33:07.158685	t	Đã thêm MacBook Pro 14 M3 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
36	2026-04-16 14:30:31.855254	2026-04-16 14:33:07.161712	t	Đã cập nhật số lượng Samsung Galaxy S24 Ultra trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
37	2026-04-16 14:30:31.855254	2026-04-16 14:33:07.163106	t	Đã cập nhật số lượng Samsung Galaxy S24 Ultra trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
23	2026-04-16 11:32:08.050656	2026-04-16 11:32:08.05068	f	thông báo\n	[SYSTEM] Cửa hàng 	4
24	2026-04-16 11:32:08.052438	2026-04-16 11:32:08.052464	f	thông báo\n	[SYSTEM] Cửa hàng 	5
41	2026-04-17 03:35:22.970308	2026-04-17 06:19:21.675193	t	Đã thêm Laptop Lenovo LOQ 15ARP10E 83S0007AVN (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
44	2026-04-17 08:00:05.422129	2026-04-17 08:00:05.42215	f	Bảo trì cửa hàng\n	[SYSTEM] Bảo trì	4
45	2026-04-17 08:00:05.424118	2026-04-17 08:00:05.424136	f	Bảo trì cửa hàng\n	[SYSTEM] Bảo trì	5
47	2026-04-17 09:50:35.640321	2026-04-17 09:50:40.316586	t	Đã thêm iPhone 15 Pro Max 256GB (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
46	2026-04-17 08:00:05.425833	2026-04-17 09:50:40.337964	t	Bảo trì cửa hàng\n	[SYSTEM] Bảo trì	6
42	2026-04-17 06:55:15.784804	2026-04-17 09:50:40.338609	t	Đã thêm Samsung Galaxy S24 Ultra (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
40	2026-04-17 02:53:15.39075	2026-04-17 09:50:40.343239	t	Đã thêm MacBook Pro 14 M3 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
39	2026-04-17 02:53:06.84454	2026-04-17 09:50:40.345615	t	Đã thêm Samsung Galaxy S24 Ultra (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
48	2026-04-18 05:45:31.51027	2026-04-18 05:45:31.510294	f	Đã thêm Samsung Galaxy S24 Ultra (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
55	2026-04-19 11:28:02.055387	2026-04-19 13:19:39.000363	t	Đã thêm MacBook Neo (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
49	2026-04-18 11:53:49.490893	2026-04-20 10:10:40.752834	t	Đã thêm MacBook Pro 14 M3 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
50	2026-04-19 07:59:49.573611	2026-04-20 10:10:40.753381	t	Đã thêm MacBook Pro 14 M3 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
51	2026-04-19 09:24:13.798053	2026-04-20 10:10:40.753706	t	Đã cập nhật số lượng MacBook Pro 14 M3 trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
52	2026-04-19 09:30:52.374282	2026-04-20 10:10:40.753887	t	Đã cập nhật số lượng MacBook Pro 14 M3 trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
53	2026-04-19 10:12:58.375944	2026-04-20 10:10:40.754101	t	Đã cập nhật số lượng MacBook Pro 14 M3 trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
54	2026-04-19 10:27:41.438338	2026-04-20 10:10:40.754239	t	Đã thêm Laptop ASUS ROG Zephyrus G14 (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
56	2026-04-19 13:44:20.63472	2026-04-20 10:10:40.754379	t	Đã thêm Laptop HP Omnibook X Flip 14-FK0092AU BZ7P5PA (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	3
57	2026-04-19 13:48:21.970155	2026-04-20 10:10:40.754502	t	Đã cập nhật số lượng MacBook Neo trong giỏ hàng\n/cart	[CART] Giỏ hàng	3
58	2026-04-20 10:25:32.945919	2026-04-20 10:25:32.945944	f	Đã thêm MacBook Neo (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
59	2026-04-20 20:48:12.238822	2026-04-20 20:48:12.238863	f	Đã thêm MacBook Neo (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
60	2026-04-20 20:49:52.174303	2026-04-20 20:49:52.17433	f	Đã thêm iPhone 15 Pro Max 256GB (x1) vào giỏ hàng\n/cart	[CART] Giỏ hàng	6
\.

-- 15. inventory_transactions
COPY public.inventory_transactions (id, created_at, updated_at, balance_after, created_by, note, quantity, reference_number, transaction_type, warehouse_location, variant_id) FROM stdin;
1	2026-04-14 16:08:14.039868	2026-04-14 16:08:14.040011	19	3	Checkout for order	1	ORDER_TEMP_ord_1776182893771_xhb9fpo5w	EXPORT	MAIN_WAREHOUSE	2
2	2026-04-14 16:15:17.008545	2026-04-14 16:15:17.008637	44	3	Checkout for order	1	ORDER_TEMP_ord_1776183316798_w6g50lfz9	EXPORT	MAIN_WAREHOUSE	4
35	2026-04-15 06:41:50.900069	2026-04-15 06:41:50.900137	49	3	Checkout for order	1	ORDER_TEMP_ord_1776235310640_1t8toh5qu	EXPORT	MAIN_WAREHOUSE	3
36	2026-04-15 14:41:41.732777	2026-04-15 14:41:41.732818	6	3	Checkout for order	4	ORDER_TEMP_ord_1776264101667_oo62sbmqp	EXPORT	MAIN_WAREHOUSE	6
37	2026-04-15 15:58:37.957192	2026-04-15 15:58:37.957252	28	3	Checkout for order	2	ORDER_TEMP_ord_1776268717893_t1v9i6fqa	EXPORT	MAIN_WAREHOUSE	21
38	2026-04-15 15:58:37.972088	2026-04-15 15:58:37.972121	2	3	Checkout for order	4	ORDER_TEMP_ord_1776268717893_t1v9i6fqa	EXPORT	MAIN_WAREHOUSE	6
39	2026-04-15 15:58:37.983727	2026-04-15 15:58:37.983754	43	3	Checkout for order	1	ORDER_TEMP_ord_1776268717893_t1v9i6fqa	EXPORT	MAIN_WAREHOUSE	4
40	2026-04-16 02:59:26.854282	2026-04-16 02:59:26.854318	42	6	Checkout for order	1	ORDER_TEMP_ord_1776308366797_uiq14tvns	EXPORT	MAIN_WAREHOUSE	4
41	2026-04-16 03:11:33.840914	2026-04-16 03:11:33.840966	1	6	Checkout for order	1	ORDER_TEMP_ord_1776309093734_yb6y3i4q3	EXPORT	MAIN_WAREHOUSE	6
42	2026-04-16 03:28:57.934202	2026-04-16 03:28:57.934375	0	6	Checkout for order	1	ORDER_TEMP_ord_1776310137840_vw9ec0o7t	EXPORT	MAIN_WAREHOUSE	6
43	2026-04-16 03:28:57.97109	2026-04-16 03:28:57.971207	39	6	Checkout for order	1	ORDER_TEMP_ord_1776310137840_vw9ec0o7t	EXPORT	MAIN_WAREHOUSE	10
44	2026-04-16 03:42:12.600566	2026-04-16 03:42:12.600617	14	6	Checkout for order	1	ORDER_TEMP_ord_1776310932354_8at46a3qj	EXPORT	MAIN_WAREHOUSE	5
45	2026-04-16 03:42:59.660424	2026-04-16 03:42:59.660477	15	6	Customer cancelled order	1	ORDER_CANCEL_41	RETURN	MAIN_WAREHOUSE	5
46	2026-04-16 05:42:47.927713	2026-04-16 05:42:47.927748	16	6	Checkout for order	4	ORDER_TEMP_ord_1776318167856_x40puukts	EXPORT	MAIN_WAREHOUSE	9
47	2026-04-16 05:42:50.02378	2026-04-16 05:42:50.023816	12	6	Checkout for order	4	ORDER_TEMP_ord_1776318169985_j4x2j1ln7	EXPORT	MAIN_WAREHOUSE	9
48	2026-04-16 11:27:24.481473	2026-04-16 11:27:24.481525	79	3	Checkout for order	1	ORDER_TEMP_ord_1776338844379_6mvxidms6	EXPORT	MAIN_WAREHOUSE	22
49	2026-04-16 11:47:14.599362	2026-04-16 11:47:14.599405	41	6	Checkout for order	1	ORDER_TEMP_ord_1776340034482_nd1urhkom	EXPORT	MAIN_WAREHOUSE	4
50	2026-04-16 11:47:14.646155	2026-04-16 11:47:14.646192	19	6	Checkout for order	1	ORDER_TEMP_ord_1776340034482_nd1urhkom	EXPORT	MAIN_WAREHOUSE	18
51	2026-04-16 12:33:33.739718	2026-04-16 12:33:33.739751	14	3	Checkout for order	1	ORDER_TEMP_ord_1776342813652_en48e2xrf	EXPORT	MAIN_WAREHOUSE	5
52	2026-04-16 14:34:20.173906	2026-04-16 14:34:20.173937	17	3	Checkout for order	3	ORDER_TEMP_ord_1776350060107_vmqn153as	EXPORT	MAIN_WAREHOUSE	26
53	2026-04-16 14:34:20.192245	2026-04-16 14:34:20.192266	17	3	Checkout for order	2	ORDER_TEMP_ord_1776350060107_vmqn153as	EXPORT	MAIN_WAREHOUSE	18
54	2026-04-16 14:34:20.203209	2026-04-16 14:34:20.20323	39	3	Checkout for order	2	ORDER_TEMP_ord_1776350060107_vmqn153as	EXPORT	MAIN_WAREHOUSE	4
55	2026-04-16 14:34:20.213502	2026-04-16 14:34:20.21357	13	3	Checkout for order	1	ORDER_TEMP_ord_1776350060107_vmqn153as	EXPORT	MAIN_WAREHOUSE	5
56	2026-04-17 02:54:05.136805	2026-04-17 02:54:05.136837	15	6	Checkout for order	1	ORDER_TEMP_ord_1776394445062_ob57ukank	EXPORT	MAIN_WAREHOUSE	6
57	2026-04-17 02:54:05.172489	2026-04-17 02:54:05.172517	38	6	Checkout for order	1	ORDER_TEMP_ord_1776394445062_ob57ukank	EXPORT	MAIN_WAREHOUSE	10
58	2026-04-17 02:54:05.187521	2026-04-17 02:54:05.187559	38	6	Checkout for order	1	ORDER_TEMP_ord_1776394445062_ob57ukank	EXPORT	MAIN_WAREHOUSE	4
59	2026-04-17 02:54:05.201403	2026-04-17 02:54:05.201442	12	6	Checkout for order	1	ORDER_TEMP_ord_1776394445062_ob57ukank	EXPORT	MAIN_WAREHOUSE	5
60	2026-04-17 04:04:24.32793	2026-04-17 04:04:24.327988	99	3	Checkout for order	1	ORDER_TEMP_ord_1776398664206_waoqpp04j	EXPORT	MAIN_WAREHOUSE	37
61	2026-04-17 06:55:49.246603	2026-04-17 06:55:49.246704	37	6	Checkout for order	1	ORDER_TEMP_ord_1776408948489_r0xnw6k4o	EXPORT	MAIN_WAREHOUSE	4
62	2026-04-17 09:50:48.550597	2026-04-17 09:50:48.55062	48	6	Checkout for order	1	ORDER_TEMP_ord_1776419447940_nlqagub3e	EXPORT	MAIN_WAREHOUSE	3
63	2026-04-18 05:45:37.951215	2026-04-18 05:45:37.951242	36	6	Checkout for order	1	ORDER_TEMP_ord_1776491137132_m11ckhlaw	EXPORT	MAIN_WAREHOUSE	4
64	2026-04-18 11:54:18.378771	2026-04-18 11:54:18.378819	11	3	Checkout for order	1	ORDER_TEMP_ord_1776513257464_kbwfvm72t	EXPORT	MAIN_WAREHOUSE	5
65	2026-04-19 10:13:14.524649	2026-04-19 10:13:14.524686	7	3	Checkout for order	4	ORDER_TEMP_ord_1776593593026_ot3i092zz	EXPORT	MAIN_WAREHOUSE	5
66	2026-04-19 10:27:48.240104	2026-04-19 10:27:48.240132	14	3	Checkout for order	1	ORDER_TEMP_ord_1776594466733_i54n6qoen	EXPORT	MAIN_WAREHOUSE	6
67	2026-04-19 13:48:25.964735	2026-04-19 13:48:25.964767	15	3	Checkout for order	2	ORDER_TEMP_ord_1776606505511_4n1kcs9dj	EXPORT	MAIN_WAREHOUSE	26
68	2026-04-19 13:48:25.992269	2026-04-19 13:48:25.992298	99	3	Checkout for order	1	ORDER_TEMP_ord_1776606505511_4n1kcs9dj	EXPORT	MAIN_WAREHOUSE	43
69	2026-04-20 10:25:39.212944	2026-04-20 10:25:39.212975	14	6	Checkout for order	1	ORDER_TEMP_ord_1776680739863_yua2jk931	EXPORT	MAIN_WAREHOUSE	26
70	2026-04-20 20:48:17.451295	2026-04-20 20:48:17.451343	13	6	Checkout for order	1	ORDER_TEMP_ord_1776692897895_t0v9kbj28	EXPORT	MAIN_WAREHOUSE	26
71	2026-04-20 20:49:57.385892	2026-04-20 20:49:57.385919	45	6	Checkout for order	3	ORDER_TEMP_ord_1776692998053_lryfkc7cc	EXPORT	MAIN_WAREHOUSE	3
72	2026-04-21 13:49:33.615823	2026-04-21 13:49:33.615857	27	3		20	\N	IMPORT	Kho Chính	5
73	2026-04-21 13:50:03.880439	2026-04-21 13:50:03.880477	28	3		1	\N	IMPORT	Kho Chính	5
\.

-- 16. wishlists
COPY public.wishlists (id, created_at, updated_at, product_id, user_id) FROM stdin;
\.

-- 17. login_history
COPY public.login_history (id, device_info, failure_reason, ip_address, location, status, "timestamp", username, user_id) FROM stdin;
1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	172.20.0.4	Local Network	FAILURE	2026-04-16 02:56:06.907129	phamtu@gmail.com	\N
2	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 02:56:19.902048	phamtu@gmail.com	\N
3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 03:17:31.865534	admin@techstore.com	\N
4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 10:27:49.701861	admin@techstore.com	\N
5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:34.393446	admin@techstore.com	\N
6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:35.956134	admin@techstore.com	\N
7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:36.563967	admin@techstore.com	\N
8	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:36.739901	admin@techstore.com	\N
9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:36.883829	admin@techstore.com	\N
10	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:10:37.033332	admin@techstore.com	\N
11	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:12:03.427065	admin@techstore.com	\N
12	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:12:04.140467	admin@techstore.com	\N
13	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:12:04.754471	admin@techstore.com	\N
14	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:12:04.968399	admin@techstore.com	\N
15	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.1	Local Network	FAILURE	2026-04-16 12:16:13.505265	admin@techstore.com	\N
16	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.1	Local Network	FAILURE	2026-04-16 12:27:00.302958	admin@techstore.com	\N
17	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.1	Local Network	FAILURE	2026-04-16 12:27:56.782034	admin@techstore.com	\N
18	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:29:28.353826	admin@techstore.com	\N
19	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:29:29.297018	admin@techstore.com	\N
20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:29:29.466448	admin@techstore.com	\N
21	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:29:29.617867	admin@techstore.com	\N
22	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:29:35.277868	admin@techstore.com	\N
23	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.1	Local Network	FAILURE	2026-04-16 12:34:34.019762	admin@techstore.com	\N
24	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:34:51.237393	admin@techstore.com	\N
25	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	JDBC exception executing SQL [select u1_0.id,u1_0.active,u1_0.avatar_url,u1_0.created_at,u1_0.date_of_birth,u1_0.deleted,u1_0.deleted_at,u1_0.email,u1_0.email_verified,u1_0.full_name,u1_0.gender,u1_0.password,u1_0.phone,u1_0.role,u1_0.status,u1_0.two_fact	172.20.0.4	Local Network	FAILURE	2026-04-16 12:34:52.498948	admin@techstore.com	\N
26	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 12:37:42.152751	admin@techstore.com	\N
27	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 12:38:23.497029	admin@techstore.com	\N
28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 12:39:02.167762	phamtu@gmail.com	\N
29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 13:51:08.154051	admin@techstore.com	\N
30	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:16.585744	phamtu12@gmail.com	\N
31	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:21.604457	phamtu12@gmail.com	\N
32	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:22.340313	phamtu12@gmail.com	\N
33	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:22.538579	phamtu12@gmail.com	\N
34	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:22.766602	phamtu12@gmail.com	\N
35	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:23.792774	phamtu12@gmail.com	\N
36	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:36.468225	phamtu12@gmail.com	\N
37	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:37:43.154288	phamtu12@gmail.com	\N
38	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:38:48.649157	phamtu12@gmail.com	\N
39	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	Bad credentials	172.20.0.1	Local Network	FAILURE	2026-04-16 16:39:13.6006	phamtu12@gmail.com	\N
40	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	172.20.0.4	Local Network	FAILURE	2026-04-16 16:41:15.288417	phamth@gmail.com	\N
41	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 16:41:31.153856	phamtu@gmail.com	\N
42	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	\N	172.20.0.1	Local Network	SUCCESS	2026-04-16 16:42:22.035923	phamtu@gmail.com	\N
43	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-16 18:28:58.7163	admin@techstore.com	\N
44	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.5	Local Network	SUCCESS	2026-04-17 13:05:37.986158	admin@techstore.com	\N
45	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.5	Local Network	SUCCESS	2026-04-17 13:36:16.000839	admin@techstore.com	\N
46	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.5	Local Network	SUCCESS	2026-04-17 13:55:11.84957	phamtu@gmail.com	\N
47	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 15:47:08.630437	admin@techstore.com	\N
48	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 15:49:49.013217	admin@techstore.com	\N
49	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 15:50:16.155892	admin@techstore.com	\N
50	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 15:55:24.408416	admin@techstore.com	\N
51	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 16:04:16.338471	admin@techstore.com	\N
52	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 16:07:32.624825	admin@techstore.com	\N
53	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 16:07:36.599475	phamtu12c@gmail.com	\N
54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 16:49:27.844643	phamtu@gmail.com	\N
55	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	172.20.0.4	Local Network	SUCCESS	2026-04-17 17:29:04.526128	customer@gmail.com	\N
56	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	172.20.0.5	Local Network	SUCCESS	2026-04-17 19:31:50.735902	admin@techstore.com	\N
57	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.9	Unknown	FAILURE	2026-04-18 12:27:58.436157	admin	\N
58	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.2	Unknown	FAILURE	2026-04-18 12:28:59.691035	admin	\N
59	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.6	Unknown	FAILURE	2026-04-18 12:29:13.09659	admin@techstore.com	\N
60	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.3	Unknown	SUCCESS	2026-04-18 12:29:26.99528	admin@techstore.com	\N
61	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Unable to connect to Redis	100.64.0.3	Unknown	FAILURE	2026-04-18 12:29:27.740891	admin@techstore.com	\N
62	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.3	Unknown	SUCCESS	2026-04-18 12:29:29.685697	admin@techstore.com	\N
63	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Unable to connect to Redis	100.64.0.3	Unknown	FAILURE	2026-04-18 12:29:30.047704	admin@techstore.com	\N
64	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.3	Unknown	SUCCESS	2026-04-18 12:38:39.142066	admin@techstore.com	\N
65	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.3	Unknown	SUCCESS	2026-04-18 12:45:25.607551	phamtu@gmail.com	\N
66	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.8	Unknown	SUCCESS	2026-04-19 14:59:00.006982	admin@techstore.com	\N
67	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	Bad credentials	100.64.0.10	Unknown	FAILURE	2026-04-19 16:49:10.020642	admin@techstore.com	\N
68	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.5607	Bad credentials	100.64.0.4	Unknown	FAILURE	2026-04-19 16:50:40.945072	admin@techstore.com	\N
69	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 15:02:51.798352	admin@techstore.com	\N
70	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.6	Unknown	SUCCESS	2026-04-20 15:34:47.799995	admin@techstore.com	\N
71	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.9	Unknown	SUCCESS	2026-04-20 16:05:45.528243	admin@techstore.com	\N
72	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.4	Unknown	SUCCESS	2026-04-20 16:22:22.06866	admin@techstore.com	\N
73	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.11	Unknown	SUCCESS	2026-04-20 16:41:06.974451	admin@techstore.com	\N
74	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.10	Unknown	SUCCESS	2026-04-20 16:43:26.8438	admin@techstore.com	\N
75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.9	Unknown	SUCCESS	2026-04-20 17:05:52.979916	admin@techstore.com	\N
76	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.7	Unknown	SUCCESS	2026-04-20 17:08:26.181218	admin@techstore.com	\N
77	Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	\N	100.64.0.7	Unknown	SUCCESS	2026-04-20 17:23:37.025624	admin@techstore.com	\N
78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.11	Unknown	SUCCESS	2026-04-20 17:25:20.953423	phamtu@gmail.com	\N
79	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.4	Unknown	SUCCESS	2026-04-20 17:39:51.619699	admin@techstore.com	\N
80	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 17:56:34.096707	admin@techstore.com	\N
81	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.8	Unknown	SUCCESS	2026-04-20 18:12:24.567668	admin@techstore.com	\N
82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.4	Unknown	SUCCESS	2026-04-20 18:30:53.772709	admin@techstore.com	\N
83	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.6	Unknown	SUCCESS	2026-04-20 18:31:01.342159	admin@techstore.com	\N
84	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.11	Unknown	SUCCESS	2026-04-20 18:49:58.677635	admin@techstore.com	\N
85	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 19:15:22.364241	admin@techstore.com	\N
86	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.11	Unknown	SUCCESS	2026-04-20 19:35:33.314799	admin@techstore.com	\N
87	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.13	Unknown	SUCCESS	2026-04-20 19:52:08.082661	admin@techstore.com	\N
88	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.6	Unknown	SUCCESS	2026-04-20 20:09:15.486084	phamtu@gmail.com	\N
89	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.10	Unknown	SUCCESS	2026-04-20 20:09:29.978447	admin@techstore.com	\N
90	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 20:28:40.951269	admin@techstore.com	\N
91	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.12	Unknown	SUCCESS	2026-04-20 20:30:12.69799	admin@techstore.com	\N
92	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.6	Unknown	SUCCESS	2026-04-20 20:39:02.090653	phamtu@gmail.com	\N
93	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 20:45:52.500233	admin@techstore.com	\N
94	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.3	Unknown	FAILURE	2026-04-20 20:46:32.60822	phamtu12c@gmail.com	\N
95	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.12	Unknown	FAILURE	2026-04-20 20:46:39.808016	phamtu12c@gmail.com	\N
96	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	Bad credentials	100.64.0.9	Unknown	FAILURE	2026-04-20 20:46:43.339262	phamtu12c@gmail.com	\N
97	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.12	Unknown	SUCCESS	2026-04-20 20:47:15.376231	phamtu@gmail.com	\N
98	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.9	Unknown	SUCCESS	2026-04-20 21:00:55.938669	admin@techstore.com	\N
99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.13	Unknown	SUCCESS	2026-04-20 21:11:57.775767	phamtu@gmail.com	\N
100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.2	Unknown	SUCCESS	2026-04-20 21:24:31.62917	admin@techstore.com	\N
101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-20 21:42:59.764589	admin@techstore.com	\N
102	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.2	Unknown	SUCCESS	2026-04-21 10:58:15.615902	admin@techstore.com	\N
103	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.2	Unknown	SUCCESS	2026-04-21 11:17:49.137235	admin@techstore.com	\N
104	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.13	Unknown	SUCCESS	2026-04-21 11:38:06.655953	admin@techstore.com	\N
105	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.3	Unknown	SUCCESS	2026-04-21 12:44:00.407584	admin@techstore.com	\N
106	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.10	Unknown	SUCCESS	2026-04-21 13:20:41.346543	admin@techstore.com	\N
107	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	100.64.0.5	Unknown	SUCCESS	2026-04-21 13:44:10.157109	admin@techstore.com	\N
\.

-- 18. wishlists
COPY public.wishlists (id, created_at, updated_at, product_id, user_id) FROM stdin;
\.

-- 19. backups
COPY public.backups (id, created_at, file_name, file_size) FROM stdin;
\.

-- 20. security_settings
COPY public.security_settings (id, created_at, updated_at, access_token_lifetime_minutes, account_lockout_minutes, allowed_two_factor_methods, api_key_auth_enabled, cors_allowed_domains, ip_blacklist, ip_whitelist, max_failed_login_attempts, password_expiration_days, password_min_length, rate_limit_per_minute, refresh_token_lifetime_days, remember_me_enabled, remember_me_lifetime_days, require_numeric, require_special_char, require_uppercase, session_timeout_minutes, two_factor_enabled, last_modified_by) FROM stdin;
1	2026-04-16 02:03:27.646423	2026-04-16 02:07:49.155202	15	30	[]	f	[]	[]	[]	5	90	8	100	7	f	30	t	t	t	30	f	3
2	2026-04-16 02:03:27.646423	2026-04-16 02:26:01.021157	15	30	[]	f	[]	[]	[]	5	90	8	100	7	f	30	t	t	t	30	f	3
\.

-- 21. store_settings
COPY public.store_settings (id, created_at, updated_at, address, hotline_phone, logo_url, setting_key, store_name, support_email) FROM stdin;
1	2026-04-15 06:14:09.634975	2026-04-16 11:33:46.792375	123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh	0987.654.323	http://res.cloudinary.com/dssehge7q/image/upload/v1776339223/techstore/settings/xuspl4vtuz5gzkgtuqes.gif	general	Tech Store	support@techstore.com
\.
