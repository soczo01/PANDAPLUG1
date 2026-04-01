-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: pandaplug1
-- ------------------------------------------------------
-- Server version	8.0.42
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'2025-12-15 08:30:52'),(2,5,'2026-01-14 10:28:14'),(3,6,'2026-01-14 10:28:55'),(4,8,'2026-01-28 11:42:08'),(5,7,'2026-01-30 10:43:16'),(6,10,'2026-02-24 10:30:07'),(7,11,'2026-03-23 10:18:09'),(8,12,'2026-04-01 09:22:26');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `termek_id` int NOT NULL,
  `mennyiseg` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `termek_id` (`termek_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (74,4,240,3),(92,6,242,1),(109,2,236,9),(110,2,238,1),(113,8,217,1);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elerhetoseg`
--

DROP TABLE IF EXISTS `elerhetoseg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elerhetoseg` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statusz` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `statusz` (`statusz`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elerhetoseg`
--

LOCK TABLES `elerhetoseg` WRITE;
/*!40000 ALTER TABLE `elerhetoseg` DISABLE KEYS */;
INSERT INTO `elerhetoseg` VALUES (2,'nincs_raktaron'),(1,'raktaron');
/*!40000 ALTER TABLE `elerhetoseg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marka`
--

DROP TABLE IF EXISTS `marka`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marka` (
  `id` int NOT NULL AUTO_INCREMENT,
  `markanev` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `markanev` (`markanev`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci AVG_ROW_LENGTH=372;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marka`
--

LOCK TABLES `marka` WRITE;
/*!40000 ALTER TABLE `marka` DISABLE KEYS */;
INSERT INTO `marka` VALUES (44,'ACG'),(32,'Ami'),(4,'Amiri'),(37,'ARC\'TERYX'),(31,'ASSC'),(30,'Balenciaga'),(20,'Bape'),(12,'Broken Planet'),(15,'Burberry'),(7,'Carhartt'),(38,'Carsicko'),(29,'Casablanca'),(9,'Chrome Hearts'),(39,'Company'),(13,'Corteiz'),(21,'CP Company'),(41,'Denim Tears'),(5,'Dsquared2'),(1,'Essentials'),(6,'Evisu'),(25,'Gucci'),(10,'Hellstar'),(40,'Jordan'),(22,'Lacoste'),(8,'Louis Vuitton'),(17,'Maison Margiela'),(16,'Moncler'),(43,'Nike'),(26,'Palm Angels'),(28,'Pink Floyd'),(14,'Polo Ralph Lauren'),(27,'Prada'),(33,'Ralph Lauren'),(19,'Revenge'),(42,'Rhude'),(36,'Sp5der'),(34,'Stone Island'),(24,'Stussy'),(35,'Supreme'),(2,'Syna World'),(3,'Vicinity'),(18,'VLONE'),(23,'Yamaha'),(11,'Yeezy');
/*!40000 ALTER TABLE `marka` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meret`
--

DROP TABLE IF EXISTS `meret`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meret` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meret` varchar(10) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meret` (`meret`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meret`
--

LOCK TABLES `meret` WRITE;
/*!40000 ALTER TABLE `meret` DISABLE KEYS */;
INSERT INTO `meret` VALUES (4,'L'),(3,'M'),(2,'S'),(5,'XL'),(1,'XS'),(6,'XXL');
/*!40000 ALTER TABLE `meret` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `termek_id` int DEFAULT NULL,
  `nev` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `meret` varchar(50) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `ar` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (27,16,167,'Lacoste  polo','XXL',27.00),(28,16,247,'Dsquared 2 jeans','XL',19.00),(29,17,162,'Ralph Lauren Tee','XXL',16.00),(30,17,20,'VLONE Tees','XL',11.00),(31,17,18,'VLONE Tees','XS',11.00),(32,17,14,'VLONE Tees','S',11.00),(33,18,242,'Amiri  jeans','XXL',19.00),(34,18,240,'Vicinity  pant ','L',8.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `telefon` varchar(100) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `cim` text COLLATE utf8mb4_hungarian_ci,
  `osszeg` decimal(10,2) DEFAULT NULL,
  `datum` datetime DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (16,'testuser2','test2@user.com','06702726482','Budapest, Fő utca 1.',46.00,'2026-04-01 09:23:40',NULL),(17,'testuser','test@user.com','06306297561','Pécs, Nyár utca 8.',49.00,'2026-04-01 09:31:30',NULL),(18,'testuser','test@user.com','067083762873','Mezőtúr, Petőfi Tér 1.',27.00,'2026-04-01 11:18:21',11);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `szin`
--

DROP TABLE IF EXISTS `szin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `szin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `szin` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `szin` (`szin`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `szin`
--

LOCK TABLES `szin` WRITE;
/*!40000 ALTER TABLE `szin` DISABLE KEYS */;
INSERT INTO `szin` VALUES (9,'Barna'),(8,'Bézs'),(2,'Fehér'),(1,'Fekete'),(4,'Kék'),(10,'Lila'),(11,'Narancssárga'),(5,'Piros'),(12,'Rózsaszín'),(7,'Sárga'),(3,'Szürke'),(6,'Zöld');
/*!40000 ALTER TABLE `szin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `termekek`
--

DROP TABLE IF EXISTS `termekek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `termekek` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `ar_usd` int NOT NULL,
  `szin_id` int NOT NULL,
  `meret_id` int NOT NULL,
  `elerhetoseg_id` int NOT NULL,
  `tipus_id` int NOT NULL,
  `kep_id` varchar(8) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `marka_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kep_id` (`kep_id`),
  KEY `FK_termekek_marka_id` (`marka_id`),
  KEY `FK_termekek_szin_id` (`szin_id`),
  KEY `termekek_ibfk_1` (`tipus_id`),
  KEY `termekek_ibfk_3` (`meret_id`),
  KEY `termekek_ibfk_4` (`elerhetoseg_id`),
  CONSTRAINT `FK_termekek_marka_id` FOREIGN KEY (`marka_id`) REFERENCES `marka` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_termekek_szin_id` FOREIGN KEY (`szin_id`) REFERENCES `szin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`tipus_id`) REFERENCES `tipus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `termekek_ibfk_3` FOREIGN KEY (`meret_id`) REFERENCES `meret` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `termekek_ibfk_4` FOREIGN KEY (`elerhetoseg_id`) REFERENCES `elerhetoseg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=357 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci AVG_ROW_LENGTH=185;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termekek`
--

LOCK TABLES `termekek` WRITE;
/*!40000 ALTER TABLE `termekek` DISABLE KEYS */;
INSERT INTO `termekek` VALUES (1,'Masion Margiela   Tees',14,2,6,1,1,'image1',17),(2,'Masion Margiela   Tees',14,1,2,2,1,'image2',17),(3,'syna world  Tees',14,1,5,1,1,'image3',2),(4,'syna world  Tees',14,2,4,1,1,'image4',2),(5,'syna world  Tees',14,2,4,2,1,'image5',2),(6,'syna world suits',25,2,4,1,1,'image6',2),(7,'syna world suits',25,1,1,1,1,'image7',2),(8,'syna world  Tees',14,2,6,1,1,'image8',2),(9,'VLONE Tees',11,1,2,1,1,'image9',18),(10,'VLONE Tees',11,1,2,1,1,'image10',18),(11,'VLONE Tees',11,2,5,1,1,'image11',18),(12,'VLONE Tees',11,1,4,2,1,'image12',18),(13,'VLONE Tees',11,2,4,1,1,'image13',18),(14,'VLONE Tees',11,4,2,1,1,'image14',18),(15,'VLONE Tees',11,2,6,2,1,'image15',18),(16,'VLONE Tees',11,2,1,2,1,'image16',18),(17,'VLONE Tees',11,1,5,1,1,'image17',18),(18,'VLONE Tees',11,2,1,1,1,'image18',18),(19,'VLONE Tees',11,1,1,1,1,'image19',18),(20,'VLONE Tees',11,1,5,1,1,'image20',18),(21,'VLONE Tees',11,2,5,2,1,'image21',18),(22,'VLONE Tees',11,1,5,2,1,'image22',18),(23,'VLONE Tees',11,8,2,2,1,'image23',18),(24,'VLONE Tees',11,1,2,1,1,'image24',18),(25,'VLONE Tees',11,1,1,1,1,'image25',18),(26,'VLONE Tees',11,1,2,2,1,'image26',18),(27,'VLONE Tees',11,1,4,2,1,'image27',18),(28,'VLONE Tees',11,1,3,2,1,'image28',18),(29,'VLONE Tees',11,1,3,1,1,'image29',18),(30,'VLONE Tees',11,2,1,1,1,'image30',18),(31,'VLONE Tees',11,11,5,2,1,'image31',18),(32,'Ralph Lauren Tee',12,1,2,1,1,'image32',33),(33,'Ralph Lauren Tee',12,3,2,1,1,'image33',33),(34,'Ralph Lauren Tee',12,2,2,2,1,'image34',33),(35,'Ralph Lauren Tee',12,4,2,2,1,'image35',33),(36,'Ralph Lauren Tee',12,2,6,1,1,'image36',33),(37,'Ralph Lauren Tee',12,3,2,2,1,'image37',33),(38,'Ralph Lauren Tee',12,4,2,2,1,'image38',33),(39,'Casablanca T-Shirts',12,3,3,1,1,'image39',29),(40,'Casablanca set ',17,1,4,1,1,'image40',29),(41,'Casablanca T-Shirts',12,2,1,2,1,'image41',29),(42,'Casablanca T-Shirts',12,2,3,2,1,'image42',29),(43,'Casablanca T-Shirts',12,1,6,2,1,'image43',29),(44,'Casablanca T-Shirts',12,2,6,1,1,'image44',29),(45,'Casablanca T-Shirts',12,2,1,2,1,'image45',29),(46,'Casablanca T-Shirts',12,4,1,1,1,'image46',29),(47,'Balenciaga  T-Shirts',12,1,2,2,1,'image47',30),(48,'ASSC ANTI T-Shirts',10,4,4,1,1,'image48',31),(49,'ASSC ANTI T-Shirts',10,1,5,1,1,'image49',31),(50,'ASSC ANTI T-Shirts',10,12,2,2,1,'image50',31),(51,'ASSC ANTI T-Shirts',10,4,1,1,1,'image51',31),(52,'Corteiz Tees',17,2,3,2,1,'image52',13),(53,'Corteiz Tees',17,1,4,1,1,'image53',13),(54,'Corteiz Tees',17,2,1,2,1,'image54',13),(55,'Corteiz Tees',17,2,6,1,1,'image55',13),(56,'Corteiz Tees',17,2,6,2,1,'image56',13),(57,'Corteiz Tees',17,1,3,1,1,'image57',13),(58,'Corteiz Tees',17,2,3,1,1,'image58',13),(59,'Corteiz Tees',17,1,3,2,1,'image59',13),(60,'Corteiz Tees',17,2,5,2,1,'image60',13),(61,'Corteiz Tees',17,2,6,1,1,'image61',13),(62,'Corteiz Tees',17,1,5,1,1,'image62',13),(63,'Corteiz Tees',17,2,2,2,1,'image63',13),(64,'Corteiz Tees',18,1,6,2,1,'image64',13),(65,'Balenciaga \r\nTees',19,3,4,1,1,'image65',30),(66,'Balenciaga \r\nTees',19,1,3,1,1,'image66',30),(67,'Balenciaga \r\nTees',20,1,1,2,1,'image67',30),(68,'Balenciaga \r\nTees',21,4,4,2,1,'image68',30),(69,'Hellstar  Tees',13,1,6,2,1,'image69',10),(70,'Hellstar  Tees',13,2,3,2,1,'image70',10),(71,'Hellstar  Tees',13,1,2,1,1,'image71',10),(72,'Hellstar  Tees',13,2,6,1,1,'image72',10),(73,'Hellstar  Tees',13,2,5,2,1,'image73',10),(74,'Hellstar  Tees',13,2,3,2,1,'image74',10),(75,'Hellstar  Tees',13,1,6,1,1,'image75',10),(76,'Hellstar  Tees',13,2,4,2,1,'image76',10),(77,'Hellstar  Tees',13,1,1,2,1,'image77',10),(78,'Hellstar  Tees',13,1,3,2,1,'image78',10),(79,'Hellstar  Tees',13,1,1,2,1,'image79',10),(80,'Hellstar  Tees',13,3,6,2,1,'image80',10),(81,'Hellstar  Tees',13,1,1,1,1,'image81',10),(82,'Hellstar  Tees',13,1,2,1,1,'image82',10),(83,'Hellstar  Tees',13,1,1,2,1,'image83',10),(84,'Chrome Hearts  T-Shirts',15,2,5,2,1,'image84',9),(85,'Chrome Hearts  T-Shirts',15,12,1,1,1,'image85',9),(86,'Chrome Hearts  T-Shirts',14,1,1,1,1,'image86',9),(87,'Chrome Hearts  T-Shirts',14,1,1,1,1,'image87',9),(88,'Chrome Hearts  T-Shirts',14,2,1,1,1,'image88',9),(89,'Chrome Hearts  T-Shirts',16,1,6,2,1,'image89',9),(90,'Chrome Hearts  T-Shirts',16,1,6,2,1,'image90',9),(91,'Chrome Hearts  T-Shirts',15,2,1,1,1,'image91',9),(92,'Chrome Hearts  T-Shirts',15,2,2,2,1,'image92',9),(93,'Chrome Hearts  T-Shirts',15,1,3,1,1,'image93',9),(94,'Chrome Hearts  T-Shirts',15,1,2,2,1,'image94',9),(95,'Chrome Hearts  T-Shirts',15,1,4,1,1,'image95',9),(96,'Chrome Hearts  T-Shirts',14,2,1,1,1,'image96',9),(97,'Chrome Hearts  T-Shirts',14,2,3,1,1,'image97',9),(98,'Chrome Hearts  T-Shirts',15,1,5,1,1,'image98',9),(99,'Chrome Hearts  T-Shirts',14,1,5,2,1,'image99',9),(100,'Chrome Hearts  T-Shirts',14,3,3,2,1,'image100',9),(101,'Chrome Hearts  T-Shirts',17,11,3,1,1,'image101',9),(102,'Chrome Hearts  T-Shirts',17,2,2,2,1,'image102',9),(103,'Chrome Hearts  T-Shirts',14,1,6,1,1,'image103',9),(104,'Chrome Hearts  T-Shirts',14,5,2,2,1,'image104',9),(105,'Chrome Hearts  T-Shirts',14,11,3,2,1,'image105',9),(106,'Chrome Hearts  T-Shirts',15,12,3,2,1,'image106',9),(107,'Chrome Hearts  T-Shirts',15,2,1,2,1,'image107',9),(108,'Chrome Hearts  T-Shirts',15,1,5,1,1,'image108',9),(109,'Chrome Hearts  T-Shirts',15,1,3,2,1,'image109',9),(110,'Chrome Hearts  T-Shirts',15,1,2,2,1,'image110',9),(111,'Chrome Hearts  T-Shirts',14,2,5,2,1,'image111',9),(112,'Chrome Hearts  T-Shirts',14,3,2,1,1,'image112',9),(113,'Chrome Hearts  T-Shirts',18,2,1,2,1,'image113',9),(114,'Chrome Hearts  T-Shirts',15,2,3,2,1,'image114',9),(115,'Chrome Hearts  T-Shirts',15,1,1,2,1,'image115',9),(116,'Chrome Hearts  T-Shirts',14,2,1,1,1,'image116',9),(117,'Amiri Tees',13,6,2,2,1,'image117',4),(118,'Amiri Tees',13,4,5,1,1,'image118',4),(119,'Amiri Tees',12,6,1,2,1,'image119',4),(120,'Amiri Tees',12,1,3,2,1,'image120',4),(121,'Amiri  Tees',13,2,2,1,1,'image121',4),(122,'Amiri  Tees',13,1,3,1,1,'image122',4),(123,'Amiri  Tees',13,2,6,2,1,'image123',4),(124,'Amiri  Tees',13,4,2,1,1,'image124',4),(125,'Amiri  Tees',13,12,3,2,1,'image125',4),(126,'Amiri  Tees',13,1,3,1,1,'image126',4),(127,'Amiri  Tees',13,2,4,1,1,'image127',4),(128,'Amiri  Tees',13,1,1,1,1,'image128',4),(129,'Amiri  Tees',13,2,5,1,1,'image129',4),(130,'Amiri  Tees',13,4,3,1,1,'image130',4),(131,'Amiri  Tees',13,4,5,2,1,'image131',4),(132,'Amiri  Tees',13,4,3,2,1,'image132',4),(133,'Revenge T-Shirts',15,1,5,2,1,'image133',19),(134,'Revenge T-Shirts',15,8,4,2,1,'image134',19),(135,'Revenge T-Shirts',15,1,5,1,1,'image135',19),(136,'Revenge T-Shirts',15,1,2,2,1,'image136',19),(137,'Revenge T-Shirts',15,1,4,2,1,'image137',19),(138,'Revenge T-Shirts',15,1,1,2,1,'image138',19),(139,'Revenge T-Shirts',15,2,1,1,1,'image139',19),(140,'Revenge T-Shirts',15,1,3,1,1,'image140',19),(141,'Revenge T-Shirts',15,1,3,1,1,'image141',19),(142,'Revenge T-Shirts',15,2,5,1,1,'image142',19),(143,'Bape Tees',12,1,4,2,1,'image143',20),(144,'Bape Tees',12,1,2,2,1,'image144',20),(145,'Bape Tees',12,1,5,2,1,'image145',20),(146,'Bape Tees',12,2,4,2,1,'image146',20),(147,'Bape Tees',12,1,6,1,1,'image147',20),(148,'Bape Tees',12,2,3,1,1,'image148',20),(149,'Bape Tees',12,1,5,1,1,'image149',20),(150,'Bape Tees',12,3,6,2,1,'image150',20),(151,'Bape Tees',12,1,5,1,1,'image151',20),(152,'Bape Tees',12,8,4,2,1,'image152',20),(153,'Bape Tees',12,1,2,1,1,'image153',20),(154,'Bape Tees',12,3,4,1,1,'image154',20),(155,'Bape  polo shirt',13,1,6,2,1,'image155',20),(156,'Cp Compagny polo shirt',15,1,2,1,1,'image156',21),(157,'Cp Compagny polo shirt',15,3,1,2,1,'image157',21),(158,'Ralph Lauren Button Up Shirt',26,3,4,2,1,'image158',33),(159,'Ralph Lauren Tee',16,1,3,1,1,'image159',33),(160,'Ralph Lauren Tee',16,2,6,2,1,'image160',33),(161,'Ralph Lauren Tee',16,4,2,2,1,'image161',33),(162,'Ralph Lauren Tee',16,3,6,2,1,'image162',33),(163,'Ralph Lauren Tee',16,2,1,1,1,'image163',33),(164,'Lacoste  polo',27,1,1,2,1,'image164',22),(165,'Lacoste  polo',27,1,1,2,1,'image165',22),(166,'Lacoste  polo',27,2,1,1,1,'image166',22),(167,'Lacoste  polo',27,3,6,2,1,'image167',22),(168,'Lacoste t-shirt',21,1,2,2,1,'image168',22),(169,'Lacoste t-shirt',21,2,5,1,1,'image169',22),(170,'Lacoste t-shirt',21,4,6,2,1,'image170',22),(171,'Lacoste t-shirt',21,3,6,1,1,'image171',22),(172,'Lacoste t-shirt',21,4,1,2,1,'image172',22),(173,'Lacoste t-shirt',21,12,4,2,1,'image173',22),(174,'Yamha polo t-shirt',5,2,5,1,1,'image174',23),(175,'Stussy  t-shirt',14,2,4,2,1,'image175',24),(176,'Stussy  t-shirt',13,1,1,1,1,'image176',24),(177,'Stussy  t-shirt',13,2,4,2,1,'image177',24),(178,'Stussy  t-shirt',13,5,2,1,1,'image178',24),(179,'Stussy  t-shirt',13,4,3,2,1,'image179',24),(180,'Stussy  t-shirt',13,8,6,1,1,'image180',24),(181,'Stussy  t-shirt',13,1,4,2,1,'image181',24),(182,'Stussy  t-shirt',13,1,3,1,1,'image182',24),(183,'Stussy  t-shirt',13,1,6,1,1,'image183',24),(184,'Stussy  t-shirt',13,1,1,2,1,'image184',24),(185,'Stussy  t-shirt',13,1,2,1,1,'image185',24),(186,'Nike x Stussy black white t-shirt',13,1,1,2,1,'image186',24),(187,'Nike x Stussy white black  t-shirt',13,2,2,2,1,'image187',24),(188,'Nike x Stussy green white t-shirt',13,6,2,1,1,'image188',24),(189,'Stussy  t-shirt',13,1,6,2,1,'image189',24),(190,'Stussy  t-shirt',13,2,2,2,1,'image190',24),(191,'Stussy  t-shirt',13,2,1,1,1,'image191',24),(192,'Stussy  t-shirt',13,1,2,1,1,'image192',24),(193,'Stussy  t-shirt',13,2,3,2,1,'image193',24),(194,'Stussy  t-shirt',13,1,6,2,1,'image194',24),(195,'Stussy  t-shirt',13,2,1,2,1,'image195',24),(196,'Stussy  t-shirt',13,1,2,2,1,'image196',24),(197,'Polo Gucci Tees',37,6,6,2,1,'image197',25),(198,'Polo Gucci Tees',34,1,1,2,1,'image198',25),(199,'Polo Gucci Tees',39,4,2,2,1,'image199',25),(200,'Polo Gucci Tees',37,1,5,2,1,'image200',25),(201,'Polo Gucci Tees',33,2,4,1,1,'image201',25),(202,'Polo Gucci Tees',48,8,6,1,1,'image202',25),(203,'Polo Gucci Tees',48,4,3,1,1,'image203',25),(204,'Polo Gucci Tees',48,5,4,2,1,'image204',25),(205,'Polo Gucci Tees',48,6,2,1,1,'image205',25),(206,'Polo Gucci Tees',48,4,3,1,1,'image206',25),(207,'Polo Gucci Tees',48,12,3,1,1,'image207',25),(208,'Polo Gucci Tees',48,9,4,2,1,'image208',25),(209,'Burberry  Tees',27,6,3,1,1,'image209',15),(210,'Burberry  Tees',27,2,1,2,1,'image210',15),(211,'Burberry  Tees',27,1,1,1,1,'image211',15),(212,'Palm Angels Tees',14,6,4,1,1,'image212',26),(213,'Palm Angels Tees',14,1,1,1,1,'image213',26),(214,'Palm Angels Tees',14,1,6,1,1,'image214',26),(215,'Palm Angels Tees',14,2,2,2,1,'image215',26),(216,'Palm Angels Tees',14,1,1,2,1,'image216',26),(217,'Moncler POLO',16,3,2,2,1,'image217',16),(218,'Moncler POLO',16,2,5,1,1,'image218',16),(219,'Moncler POLO',16,1,5,1,1,'image219',16),(220,'Moncler Tees',16,1,2,2,1,'image220',16),(221,'Moncler Tees',16,2,1,1,1,'image221',16),(222,'Moncler Tees',16,1,3,1,1,'image222',16),(223,'Moncler Tees',16,8,1,1,1,'image223',16),(224,'Moncler Tees',16,2,4,1,1,'image224',16),(225,'Moncler Tees',16,2,2,2,1,'image225',16),(226,'PRADA  T-shirt',20,12,6,1,1,'image226',27),(227,'PRADA  T-shirt',20,1,2,1,1,'image227',27),(228,'PINK Floyd T-shirt',15,4,4,1,1,'image228',28),(229,'PINK Floyd T-shirt',15,1,1,2,1,'image229',28),(230,'PINK Floyd T-shirt',14,2,3,1,1,'image230',28),(233,'Polo Ralph Lauren track pant ',30,3,1,2,2,'image233',14),(234,'Polo Ralph Lauren track pant ',30,1,6,2,2,'image234',14),(235,'Polo Ralph Lauren track pant ',30,2,5,2,2,'image235',14),(236,'Essentials pant ',260,3,2,1,2,'image236',1),(238,'syna world pant ',18,4,1,1,2,'image238',2),(239,'syna world pant ',18,3,5,2,2,'image239',2),(240,'Vicinity  pant ',8,1,4,1,2,'image240',3),(241,'Amiri  jeans',19,1,1,2,2,'image241',4),(242,'Amiri  jeans',19,1,6,1,2,'image242',4),(243,'Amiri  jeans',19,4,2,2,2,'image243',4),(244,'Amiri  jeans',19,1,2,1,2,'image244',4),(245,'Amiri  jeans',19,4,2,1,2,'image245',4),(246,'Dsquared 2 jeans',19,1,5,2,2,'image246',5),(247,'Dsquared 2 jeans',19,4,5,1,2,'image247',5),(248,'Dsquared 2 jeans',19,1,5,2,2,'image248',5),(249,'Dsquared 2 jeans',19,4,5,2,2,'image249',5),(250,'Evisu  jeans',25,3,4,1,2,'image250',6),(251,'Evisu  jeans',25,1,6,2,2,'image251',6),(252,'Evisu  jeans',25,1,1,2,2,'image252',6),(253,'Carhartt Cargo',19,4,3,1,2,'image253',7),(254,'Carhartt Cargo',30,1,2,1,2,'image254',7),(255,'Carhartt Cargo',30,8,2,2,2,'image255',7),(256,'Carhartt Cargo',30,6,3,2,2,'image256',7),(257,'Carhartt Cargo',30,1,2,2,2,'image257',7),(258,'Carhartt WIP\r\nPants',25,4,3,2,2,'image258',7),(259,'Carhartt WIP\r\nPants',25,1,3,2,2,'image259',7),(260,'Carhartt Pants',30,1,1,2,2,'image260',7),(261,'Carhartt Pants',30,3,4,1,2,'image261',7),(262,'Carhartt Pants',30,9,6,2,2,'image262',7),(263,'Carhartt Pants',30,8,3,1,2,'image263',7),(264,'Burberry x Supreme Pants',41,4,6,2,2,'image264',15),(265,'Louis Vuitton jeans',66,3,1,1,2,'image265',8),(266,'Louis Vuitton jeans',66,4,5,1,2,'image266',8),(267,'Chrome Hearts  jeans',27,4,5,1,2,'image267',9),(268,'Chrome Hearts  jeans',27,4,4,1,2,'image268',9),(269,'Chrome Hearts  jeans',27,4,3,1,2,'image269',9),(270,'Chrome Hearts  jeans',60,3,6,1,2,'image270',9),(271,'Hellstar  Pants',22,1,6,1,2,'image271',10),(272,'Hellstar  Pants',22,1,6,1,2,'image272',10),(273,'Hellstar  Pants',22,1,2,2,2,'image273',10),(274,'Hellstar  Pants',22,4,5,1,2,'image274',10),(275,'Hellstar  Pants',22,1,5,2,2,'image275',10),(276,'Yeezy Pants',19,9,4,2,2,'image276',11),(277,'Yeezy Pants',19,3,5,1,2,'image277',11),(278,'Yeezy Pants',19,1,3,2,2,'image278',11),(279,'Broken Planet  Pants',18,3,3,1,2,'image279',12),(280,'Moncer Pants',29,1,1,2,2,'image280',16),(281,'Moncer Pants',29,3,6,2,2,'image281',16),(282,'Corteiz classic cargo 5 stars black white logo pant',56,1,3,2,2,'image282',13),(283,'Corteiz Slant pocket military green pant',52,6,1,2,2,'image283',13),(284,'Corteiz classic cargo black whitelogo pant',56,4,1,1,2,'image284',13),(285,'Corteiz classic cargo black green logo pant',56,1,6,1,2,'image285',13),(286,'Corteiz classic cargo 4 stars black white logo pant',56,1,3,1,2,'image286',13),(287,'Jordan Shorts',10,1,4,2,3,'image287',40),(288,'Jordan Shorts',10,1,6,2,3,'image288',40),(289,'Jordan Shorts',10,1,1,1,3,'image289',40),(290,'Jordan Shorts',10,2,4,1,3,'image290',40),(291,'Jordan Shorts',10,1,2,1,3,'image291',40),(292,'Jordan Shorts',10,2,2,2,3,'image292',40),(293,'Jordan Shorts',10,1,1,1,3,'image293',40),(294,'Jordan Shorts',10,2,6,1,3,'image294',40),(296,'Jordan Shorts',10,1,3,1,3,'image296',40),(297,'Jordan Shorts',10,1,2,1,3,'image297',40),(298,'Jordan Shorts',10,1,2,1,3,'image298',40),(299,'Stussy Shorts',21,1,6,1,3,'image299',24),(300,'Balenciaga Shorts',19,1,2,2,3,'image300',30),(301,'Denim Tears  Shorts',17,5,6,2,3,'image301',41),(302,'Denim Tears  jorts',23,1,6,1,3,'image302',41),(303,'Denim Tears  jorts',23,4,2,2,3,'image303',41),(304,'Rhude Attack Shorts',14,1,5,2,3,'image304',42),(305,'Rhude Attack Shorts',14,5,4,2,3,'image305',42),(306,'Rhude Attack Shorts',14,6,5,1,3,'image306',42),(307,'Rhude Attack Shorts',13,1,1,2,3,'image307',42),(308,'Rhude Attack Shorts',13,4,2,1,3,'image308',42),(309,'Rhude Attack Shorts',13,5,1,1,3,'image309',42),(310,'Rhude Attack Shorts',13,4,4,1,3,'image310',42),(311,'Rhude Attack Shorts',13,6,4,2,3,'image311',42),(312,'Supreme Hoodie',32,1,2,1,4,'image312',35),(313,'Supreme Hoodie',32,1,6,1,4,'image313',35),(314,'Supreme Hoodie',32,3,3,2,4,'image314',35),(315,'Supreme Hoodie',32,1,6,2,4,'image315',35),(316,'Supreme Hoodie',32,1,6,1,4,'image316',35),(317,'Supreme Hoodie',32,2,6,1,4,'image317',35),(318,'Supreme Hoodie',32,1,3,1,4,'image318',35),(319,'Supreme Hoodie',32,2,4,2,4,'image319',35),(320,'Supreme Hoodie',33,6,4,1,4,'image320',35),(321,'Sp5der Hoodie',23,1,2,2,4,'image321',36),(322,'Sp5der Hoodie',23,12,2,1,4,'image322',36),(323,'Sp5der Hoodie',23,9,3,2,4,'image323',36),(324,'Nike X ACG Jacket',36,1,6,2,4,'image324',44),(325,'Nike X ACG Jacket',36,2,4,2,4,'image325',44),(326,'Stone Island Jacket',24,1,3,1,4,'image326',34),(327,'Balenciaga Jacket',36,1,6,2,4,'image327',30),(328,'Ami sweater',19,1,6,2,4,'image328',32),(329,'Ami sweater',19,2,3,2,4,'image329',32),(330,'Ami sweater',19,8,4,1,4,'image330',32),(331,'Ami sweater',19,4,3,1,4,'image331',32),(332,'ARC\'TERYX SV7  Jacket',69,1,4,2,4,'image332',37),(333,'ARC\'TERYX  Squamish  Jacket',32,4,5,2,4,'image333',37),(334,'ARC\'TERYX  Squamish  Jacket',37,1,4,2,4,'image334',37),(335,'ARC\'TERYX   2024 LT Jacket',45,1,6,2,4,'image335',37),(336,'ARC\'TERYX  X Beams  Jacket',45,8,6,2,4,'image336',37),(337,'Carsicko signature   Hoodie',20,1,2,2,4,'image337',38),(338,'company Hoodie',31,4,5,2,4,'image338',39),(339,'company Hoodie',31,1,2,2,4,'image339',39),(340,'company Hoodie',28,1,1,1,4,'image340',39),(341,'company Hoodie',28,4,1,1,4,'image341',39),(342,'company Hoodie',28,3,2,2,4,'image342',39),(343,'Amiri Hoodie',22,1,5,1,4,'image343',4),(344,'Mardi Hoodie',14,1,1,1,4,'image344',16),(345,'Mardi Hoodie',14,2,3,1,4,'image345',16),(346,'Balenciaga Hoodie',52,4,4,2,4,'image346',30),(347,'Stone Island Hoodie',21,1,4,2,4,'image347',34),(348,'Stone Island Hoodie',21,3,4,1,4,'image348',34),(349,'Stone Island Hoodie',21,6,4,2,4,'image349',34),(350,'Stone Island Hoodie',18,4,1,2,4,'image350',34),(351,'Stone Island Hoodie',18,1,6,2,4,'image351',34),(352,'Bape Hoodie',16,1,3,2,4,'image352',20),(353,'Bape Hoodie',16,2,4,2,4,'image353',20),(354,'Bape Hoodie',16,2,2,1,4,'image354',20),(355,'Moncler  Hoodie',25,1,4,1,4,'image355',16),(356,'Moncler  Hoodie',25,2,4,2,4,'image356',16);
/*!40000 ALTER TABLE `termekek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipus`
--

DROP TABLE IF EXISTS `tipus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipus` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipus` (`tipus`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipus`
--

LOCK TABLES `tipus` WRITE;
/*!40000 ALTER TABLE `tipus` DISABLE KEYS */;
INSERT INTO `tipus` VALUES (2,'nadrag'),(1,'polo'),(4,'pulover'),(3,'rovidnadrag');
/*!40000 ALTER TABLE `tipus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nev` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'admin','admin@gmail.com','$2b$10$GfG2OkjyB8.F.mLgCNBX7uwUMx208R4vkyuGI75YcBnjGDLGkNTH.','admin'),(11,'testuser','test@user.com','$2b$10$P9.RHzNgsRvKym1GEV8icu5hVVJaZhsoktk9z4A7uLfVm.Gssc/di','user'),(12,'testuser2','test2@user.com','$2b$10$uL.3k618PRtx6YDG4K1avuXrZKsgOaf3HDmpJHXesXmeSI0kZW7f.','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view1`
--

DROP TABLE IF EXISTS `view1`;
/*!50001 DROP VIEW IF EXISTS `view1`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view1` AS SELECT 
 1 AS `termek_id`,
 1 AS `Név`,
 1 AS `Ár(usd)`,
 1 AS `Típus`,
 1 AS `Szín`,
 1 AS `Méret`,
 1 AS `Státusz`,
 1 AS `Márka`,
 1 AS `kep_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'pandaplug1'
--

--
-- Dumping routines for database 'pandaplug1'
--

--
-- Final view structure for view `view1`
--

/*!50001 DROP VIEW IF EXISTS `view1`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view1` AS select `termekek`.`id` AS `termek_id`,`termekek`.`nev` AS `Név`,`termekek`.`ar_usd` AS `Ár(usd)`,`tipus`.`tipus` AS `Típus`,`szin`.`szin` AS `Szín`,`meret`.`meret` AS `Méret`,`elerhetoseg`.`statusz` AS `Státusz`,`marka`.`markanev` AS `Márka`,`termekek`.`kep_id` AS `kep_id` from (((((`termekek` join `tipus` on((`termekek`.`tipus_id` = `tipus`.`id`))) join `szin` on((`termekek`.`szin_id` = `szin`.`id`))) join `meret` on((`termekek`.`meret_id` = `meret`.`id`))) join `elerhetoseg` on((`termekek`.`elerhetoseg_id` = `elerhetoseg`.`id`))) join `marka` on((`termekek`.`marka_id` = `marka`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 13:20:26
