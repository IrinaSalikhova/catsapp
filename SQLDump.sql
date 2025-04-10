CREATE DATABASE  IF NOT EXISTS `catmap` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `catmap`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 34.29.63.110    Database: catmap
-- ------------------------------------------------------
-- Server version	8.0.37-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'ebebb947-e4ea-11ef-a52f-42010a400002:1-10986';

--
-- Table structure for table `assetCategLinks`
--

DROP TABLE IF EXISTS `assetCategLinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assetCategLinks` (
  `assetId` int NOT NULL,
  `categoryId` int NOT NULL,
  `isMain` bit(1) DEFAULT NULL,
  PRIMARY KEY (`assetId`,`categoryId`),
  KEY `FK_Reference_6` (`categoryId`),
  KEY `idx_assetCategLinks` (`assetId`,`categoryId`),
  CONSTRAINT `FK_Reference_5` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Reference_6` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='the link table for asset and category';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assetCategLinks`
--
-- ORDER BY:  `assetId`,`categoryId`

LOCK TABLES `assetCategLinks` WRITE;
/*!40000 ALTER TABLE `assetCategLinks` DISABLE KEYS */;
INSERT INTO `assetCategLinks` (`assetId`, `categoryId`, `isMain`) VALUES (1,22,_binary '\0'),(2,52,_binary '\0'),(4,39,NULL),(5,48,NULL),(6,29,NULL),(7,16,NULL),(8,49,NULL),(9,35,NULL),(10,42,NULL),(11,34,NULL),(12,35,NULL),(13,35,NULL),(14,35,NULL),(15,34,NULL),(16,40,NULL),(17,34,NULL),(18,36,NULL),(19,46,NULL),(20,37,NULL),(21,41,NULL),(22,30,NULL),(23,64,NULL),(24,69,NULL),(25,19,NULL),(26,55,NULL),(27,58,NULL),(28,18,NULL),(29,82,NULL),(30,23,NULL),(31,45,NULL),(32,70,NULL),(33,58,NULL),(34,74,NULL),(35,13,NULL),(36,2,NULL),(37,56,NULL),(38,57,NULL),(39,39,NULL),(40,39,NULL),(41,39,NULL),(42,39,NULL),(43,39,NULL),(44,39,NULL),(45,39,NULL),(46,48,NULL),(47,48,NULL),(48,76,NULL),(49,13,NULL),(50,48,NULL),(51,48,NULL),(52,48,NULL),(53,16,NULL),(54,2,NULL),(55,51,NULL),(56,16,NULL),(57,51,NULL),(58,48,NULL),(60,48,NULL),(61,49,NULL),(62,49,NULL),(63,49,NULL),(64,49,NULL),(65,49,NULL),(66,49,NULL),(67,18,NULL),(68,42,NULL),(69,15,NULL),(70,57,NULL),(71,52,NULL),(73,37,NULL),(74,19,NULL),(75,15,NULL),(76,37,NULL),(77,41,NULL),(78,41,NULL),(79,41,NULL),(82,74,NULL),(83,67,NULL),(84,45,NULL),(85,2,NULL),(86,55,NULL),(87,22,NULL),(88,22,NULL),(109,30,NULL),(110,32,NULL),(111,50,NULL),(113,33,NULL),(114,33,NULL),(864,29,NULL),(864,85,NULL),(1297,21,NULL),(1298,49,NULL),(1299,45,NULL),(1300,56,NULL),(1301,2,NULL),(1302,23,NULL),(1303,51,NULL);
/*!40000 ALTER TABLE `assetCategLinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assetCategLinks_temp`
--

DROP TABLE IF EXISTS `assetCategLinks_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assetCategLinks_temp` (
  `assetId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`assetId`,`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assetCategLinks_temp`
--
-- ORDER BY:  `assetId`,`categoryId`

LOCK TABLES `assetCategLinks_temp` WRITE;
/*!40000 ALTER TABLE `assetCategLinks_temp` DISABLE KEYS */;
INSERT INTO `assetCategLinks_temp` (`assetId`, `categoryId`) VALUES (2,52),(4,39),(5,48),(6,29),(7,16),(8,49),(9,35),(10,42),(11,34),(12,35),(13,35),(14,35),(15,34),(16,40),(17,34),(18,36),(19,46),(20,37),(21,41),(22,30),(23,64),(24,69),(25,19),(26,55),(27,58),(28,18),(29,82),(30,23),(31,45),(32,70),(33,58),(34,74),(35,13),(36,2),(37,56),(38,57),(39,39),(40,39),(41,39),(42,39),(43,39),(44,39),(45,39),(46,48),(47,48),(48,76),(49,13),(50,48),(51,48),(52,48),(53,16),(54,2),(55,51),(56,16),(57,51),(58,48),(60,48),(61,49),(62,49),(63,49),(64,49),(65,49),(66,49),(67,18),(68,42),(69,15),(70,57),(71,52),(73,37),(74,19),(75,15),(76,37),(77,41),(78,41),(79,41),(82,74),(83,67),(84,45),(85,2),(86,55),(87,22),(88,22),(109,30),(110,32),(111,50),(113,33),(114,33);
/*!40000 ALTER TABLE `assetCategLinks_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_temp`
--

DROP TABLE IF EXISTS `asset_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_temp` (
  `id` int NOT NULL,
  `parentAssetId` int DEFAULT NULL,
  `name` text,
  `cityCode` int DEFAULT NULL,
  `address` text,
  `postCode` text,
  `isVolunOpp` text,
  `volunOppText` text,
  `phoneNumber` text,
  `email` text,
  `website` text,
  `isWheelchairAcc` text,
  `languagesOffered` text,
  `scheduleType` text,
  `registrationNote` text,
  `scheduleNote` text,
  `socialWorkerOnlyNote` text,
  `description` text,
  `isEnable` text,
  `hasChildren` text,
  `format` text,
  `transportation` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_temp`
--
-- ORDER BY:  `id`

LOCK TABLES `asset_temp` WRITE;
/*!40000 ALTER TABLE `asset_temp` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_temp_0327`
--

DROP TABLE IF EXISTS `asset_temp_0327`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_temp_0327` (
  `id` int NOT NULL,
  `Name` text,
  `address` text,
  `postCode` text,
  `longitude` decimal(16,10) DEFAULT NULL,
  `latitude` decimal(16,10) DEFAULT NULL,
  `phoneNumber` text,
  `email` text,
  `website` text,
  `Description` text,
  `Volunteer opportunities` text,
  `Languages` text,
  `Registration informatio` text,
  `schedule information` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_temp_0327`
--
-- ORDER BY:  `id`

LOCK TABLES `asset_temp_0327` WRITE;
/*!40000 ALTER TABLE `asset_temp_0327` DISABLE KEYS */;
INSERT INTO `asset_temp_0327` (`id`, `Name`, `address`, `postCode`, `longitude`, `latitude`, `phoneNumber`, `email`, `website`, `Description`, `Volunteer opportunities`, `Languages`, `Registration informatio`, `schedule information`) VALUES (1,'Carlington Community Health Center','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000',NULL,'','','','English','',''),(2,'Baby friendly initiative','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000','','https://carlingtonchc.com/programs-and-services/families/baby-friendly-initiative/','The Baby-Friendly Initiative is a global campaign of the World Health Organization (WHO) and the United Nations Children’s Fund (UNICEF). It was developed to help hospitals and community agencies protect, promote and support breastfeeding. ‘The Baby-Friendly Initiative outlines ‘best-practice’ for those working with pregnant and/or parenting families. Baby-Friendly organizations support all families with important infant feeding and infant care practices. Baby-Friendly organizations benefit babies, families, society and the environment.','N/A','English','N/A','N/A'),(4,'Prenatal and Breastfeeding support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 246',' breastfeeding@carlingtonchc.com','','Exclusive breastfeeding is important for your child’s health. Learn alongside other expectant parents in this informal virtual session. Come with your questions and get ready to learn! Hosted by Carlington’s Lactation Consultant. ','N/A','English','',' Every 2nd Thursday from 4:00 p.m. to 6:00 p.m'),(5,'Family and Parenting Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 203','EarlyON@carlingtonchc.com','','One-on-one consultation available with Family Support worker, as well as information, referrals and support regarding parenting and pregnancy. ','N/A','English','Join our qualified staff for a variety of child development and parenting topics offered in an online workshop format.  For families with children 0-6 years','N/A'),(6,'School and Readiness Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 322','EarlyON@carlingtonchc.com','','After School Program,Backpack Adventures, Summer SWAG','','','',''),(7,'Annavale Headstart Nursery School','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(8,'Youth Programs','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','https://carlingtonchc.com/programs-and-services/families/youth-programs/','','','','',''),(9,'Primary Health Care','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137222161','','https://carlingtonchc.com/programs-and-services/health-services/primary-health-care/medical-appointment-request/','Our Primary Health Care team consists of an interdisciplinary group of dedicated professionals that includes physicians, nurse practitioners, nurses, a dietitian, respiratory therapist, chiropodist and foot care nurses.','','','',''),(10,'After Hours On Call Services','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137875551','','','The After Hours On-Call Service is for sudden and unexpected illness that cannot wait until the next clinic day.If you are a registered primary care client and require medical advice that cannot wait until the office is next open.','','','You can access the service by calling 613-787-5551. When unavailable, call Telehealth Ontario at 1-866-797-0000.','Monday to Friday until 8:00 p.m. and Weekends/Holidays from 9:00 a.m. to 5:00 p.m. '),(11,'Lung Health Care','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137222161','','','Primary healthcare providers can refer clients to this program who have chronic lung disease such as asthma and COPD. A registered respiratory therapist assesses and evaluated the clients and assists them in maintaining optimal lung health','','','',''),(12,'Foot Care','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Our staff includes a certified chiropodist and foot care nurse. By appointment only.','','','',''),(13,'Immunization','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Vaccinations are available by appointment only for registered clients of the Clinic as per the Ministry of Health and Long Term Care and Ottawa Public Health guidelines. Seasonal flu shot clinics will operate for Centre clients according to Ottawa Public Health guidelines. Dates and times are posted when available.','','','',''),(14,'Dental Screenings','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','https://www.ottawapublichealth.ca/Common/PageNotFound.aspx?aspxerrorpath=/en/public-health-topics/access-to-dental-care.aspx','','','','',''),(15,'Living Well with a Chronic Condition','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','A six week workshop series offered for Chronic Disease Self-Management and Chronic Pain Self-Management. Workshops are designed to help manage a chronic condition to live a healthy life.','','','',''),(16,'Birth Control','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Information and counselling on birth control options and oral contraception purchase programs provided by appointment only for registered clients of the medical clinic.','','','',''),(17,'Nutrition Counselling','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6132383722','','','Individual nutrition counselling is available in the primary health care clinic.  Clients of the medical clinic can ask their health care provider for a referral.  Other clients who live in the Carlington catchment area may be able to access this services based on availability and reason for the request','','','',''),(18,'Assertive Community Treatment Team (ACTT)','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(19,'Crisis and Intake','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Intake Counsellor offers immediate help with personal crisis and support with food security, referrals and practical assistance. Access to our emergency food cupboard provided to those within our service area.','','','','Monday: 1:00pm – 3:30pm\nTuesday: 1:00pm – 3:30pm\nWednesday: 1:00pm – 3:30pm\nFriday: 1:00pm – 3:30pm'),(20,'Counselling','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(21,'Violence Against Women','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Available to women who are experiencing or have experienced partner abuse. We operate from a feminist perspective, which includes empowerment, support, advocacy, while maintaining a nonjudgmental approach. Some of the topics explored in sessions are the cycle of violence, elements of power and control, warning signs, impacts of abuse on women and children, healthy relationships and many more.','','','',''),(22,'Bike Repair Clinic','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Cycling is a healthy, fun and low-impact form of exercise for all ages. Easy to fit into your daily routine by riding to shops, school or work. Seasonal program offered in the summer.','','','',''),(23,'Brain Bingo!','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,' 6137224000 ext. 204','','','Bingo, health trivia and prizes! Bring your friends or make new friends with social time for people aged 55+. Free to join, everyone welcome. Tea and coffee provided.','','','','Tuesdays from 2-4pm'),(24,'Cooking for kids','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 492','','','A group that meets twice a month to cook for children in an after-school program and enjoy coffee and snacks together after.','','','',''),(25,'English Second Language Conversation Group','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Looking to improve your English while you are staying at home? Looking for a sense of community and connection? Join the conversation!','','','','Twice weekly on Tuesdays and Thursdays, 12:00 p.m. to 1:00 p.m'),(26,'Mission Food Truck','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 299.','','','In partnership with The Ottawa Mission, we’re providing warm and nutritious meals in your community!','','','',''),(27,'Healthful Food Working Group','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Interested in food security and vegetable gardening in the community? Get involved!','','','',''),(28,'Income Tax Clinic','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','https://carlingtonchc.com/taxclinic/','Free tax preparation clinic in partnership with Canada Revenue Agency (CRA). Volunteers complete tax returns for eligible individuals with a modest income and simple tax situation who live in the Carlington catchment area. Seasonal program from February to April.','','','Book an appointment:https://carlingtonchc.com/taxclinic/',''),(29,'Senior Chair Exercises','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','In partnership with Family Physio, offering free chair exercises for people aged 55+ to increase mobility and build strength and balance. Designed for all skill levels, everyone welcome! Mondays, Wednesdays, Fridays in-person streaming and online. ','','','',''),(30,'Millennium Learning Centre','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','The Millenium Learning Centre is available to the general public to access computers, gain computer skills, and access the Internet in a supportive environment.','','','',''),(31,'Safety and Security Wokring Group','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(32,'Summer Concert Series','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext.204','','','Enjoy the warm weather together at an outdoor concert in your community.  Various days and locations throughout the summer.  Everyone is welcome!','','','',''),(33,'Van Lang Community Kitchen and Meal','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(34,'Women in the wild','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext.328 ','','','Participating in outdoor recreational activities provides many physical and emotional benefits. Locations throughout Ottawa-Gatineau.  Transportation provided.','','','',''),(35,'Workshops','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(36,'Community Newsletter','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','https://ochc.us15.list-manage.com/subscribe?u=958e0c00b3a752634e50785fb&id=1b572631e0','Subscribe to Carlington’s weekly newsletter filled with upcoming events and activities in the community!','','','',''),(37,'Good Food on the Move','1290 Coldrey Avenue','K1Z0C4\n',45.3834411000,-75.7338645100,'6137450073 ext. 122','','https://www.ottawagoodfoodbox.ca/faq','Our mission is to make fruits and vegetables more accessible and affordable for Ottawa community members facing barriers to accessing fresh food.\nWe believe that everyone has the right to fresh, healthy food and that food security is possible through local unity.\nWe provide safe, reliable and convenient ways to access fresh and nutritious food, right in your community.?','','','','Order fresh fruit and vegetables online weekly from Wednesday 9:00 a.m. to Monday 9:00 a.m.  Pick up your order the following Wednesday at 2:00 p.m'),(38,'Grocery Boxes','6 Epworth Ave','K2G2L5',45.3517220600,-75.7398374100,'6137281800',NULL,'','','','','',''),(39,'Pregnant in Ottawa','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','breastfeeding@carlingtonchc.org','','Free prenatal classes open to all Ottawa residents who are pregnant. Join through the Facebook Group or email us for details.','','','',''),(40,'Prenatal Breastfeeding Info Session','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','breastfeeding@carlingtonchc.org','','Exclusive breastfeeding is important for your child’s health. Learn alongside other expectant parents in this informal virtual session. Come with your questions and get ready to learn! ','','','REGISTER:\n2nd Thursday 4:00-6:00 p.m.','Every 2nd Thursday from 4:00 p.m. to 6:00 p.m'),(41,'Breastfeeding and Infant Feeding Clinic','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','breastfeeding@carlingtonchc.org','','For women and families who would like 1:1 information on general infant feeding, and/or breastfeeding support.  Thursdays 1-3pm.  Free 30 min consultations. No appointment needed. Please note that every effort will be made to accommodate families attending, but there are limited spaces. \n\nPlan to arrive at the beginning of the clinic to register onsite, to avoid disappointment.','','','',''),(42,'Individual Lactation Consultations (Prenatal and Postnatal)','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','breastfeeding@carlingtonchc.org','','How to book your Lactation Consultation with Janice at Carlington:\n\nPlease email breastfeeding@carlingtonchc.org with the following:\n\nyour full name and date of birth,\nbaby full name and date of birth,\npreferred email and phone number\nbrief description of your lactation needs','','','',''),(43,'Q & A with the Lactation Consultant','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Join other mothers (and mothers-to-be) for an informal VIRTUAL session every Tuesday 4-5:00 pm.\nCome with your questions and learn from other mothers’ questions!','','','',''),(44,'High-risk pregnancy: Roadmap for successful breastfeeding','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'',' breastfeeding@carlingtonchc.org','','Are you experiencing a high risk pregnancy?  Worried about breastfeeding success?\n\nJoin our Lactation Consultant for a VIRTUAL Prenatal Information Session designed for families who are experiencing high risk pregnancy.\n\nLearn about specific strategies to improve your breastfeeding success.','','','',''),(45,'Buns in the Oven','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 246','','','A friendly prenatal support program for those who are pregnant and are interested in learning about pregnancy and nutrition. Connections to a lactation consultant.','','','',''),(46,'Individual Family and Parenting Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 246 ','','','One-on-one consultation available with Family Support worker, as well as information, referrals and support regarding parenting and pregnancy. By appointment only. In person and online. ','','','',''),(47,'Parenting Newborns and Infants','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(48,'Snack and Chat','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 246.','','','Health and parenting program for women interested in learning about parenting, health issues, nutrition. ','','','',''),(49,'EarlyON Workshops','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','EarlyON@carlingtonchc.com','https://carlingtonchc.com/programs-and-services/families/family-and-parenting-support/','A variety of short programs and workshops focused on child development and parenting topics, offered throughout the year, some virtual, some in-person when possible.','','','',''),(50,'Supporting Neighbourhood Caregivers','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(51,'Positive Discipline','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','EarlyON@carlingtonchc.com','','','','','',''),(52,'Nobody\'s Perfect','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(53,'EarlyON Child and Family Centre','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','EarlyON@carlingtonchc.com','','EarlyON Child and Family Centres provide opportunities for children from birth to six years of age to participate in play and inquiry-based programs, and support parents and caregivers in their roles. We offer safe and welcoming environments open to all families across Ontario, with qualified professionals and quality programs. Families and caregivers will be able to find support, make personal connections and access a network of resources.  At Carlington CHC, we are to please to welcome you and your little ones at any of our programs.','','','If you are having difficulty finding program, registering, or have questions, email us at EarlyON@carlingtonchc.com','Family Math: Support numeracy literacy through play! For families with children 3-4yo,  getting ready to start Junior Kindergarten!  6-week program, meeting once a week.\n\nBackpack Adventures: Support early literacy through play. For families with children 3-4yo, getting ready to start Junior Kindergarten!  6-week program, meeting once a week.'),(54,'EarlyON Newsletter','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(55,'EarlyON Playgroups','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','https://carlingtonchc.com/calendar/','Join us in our beautiful new playroom and garden, featuring a natural, calming, and spacious play environment at our main site or join us in a community location near you. Join our Early Childhood Educators for stories, songs, arts and crafts, and funny dances! For children ages 0-6 years. Due to limited spots registration is encouraged. ','','','','Registration via CALENDAR links or our EarlyON Newsletter.'),(56,'EarlyON Virtual Programs','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','EarlyON@carlingtonchc.com','','','','','',''),(57,'EarlyON Playgroups in the Park','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(58,'Ask Us! EarlyON One-on One Parenting Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(60,'EarlyON Parenting Groups','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(61,'After School Program','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(62,'Backpack Adventures','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(63,'Summer SWAG','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6136973213','brwentambo@carlingtonchc.org','','We provide:\n\nPreparation for High School Readiness\nFun Recreational Activities\nFieldtrips\nFundraiser Activities\nHigh School Volunteer Hours\nFood & Snacks & Much More!','','','',''),(64,'Students Will All Graduate (SWAG)','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 322.','','','Carlington Community Health Centre and community partners are collectively working to address high dropout rates in the following four communities: Shillington, Debra Dynes, Bellevue/Caldwell and Parkwood Hills.\n\nThe Students Will All Graduate (SWAG) Program provides credit-based academic support, social recreation programming, mentoring and relationship building, and skill-based leadership programming. SWAG is offered by a team of Youth Workers, Ontario Certified Teachers and Volunteers 4 days a week throughout the school year','','','',''),(65,'Youth Drop-In','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 322','','','A safe space for youth to come together, have fun, talk, participate in community activities, develop new skills and mostly, be themselves among friends.  Bellevue Community Centre.  Currently online due to COVID.','','','',''),(66,'REDBLACKS Youth Mentorship Program','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(67,'Financial Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(68,'Crisis Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(69,'Housing Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(70,'Food Cupboard','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(71,'Baby Cupboard','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Supplies, support, information and referrals for infant-related concerns.','','','',''),(73,'Youth Counselling (12-25 years of age)','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Counselling sessions are tailored to the individual needs of each youth and address common issues and concerns such as: anxiety and depression, grief and loss, anger management, family and peer relationship distress, 2SLGBTQ issues, self-esteem, and life transition difficulties.','','','',''),(74,'Settlement Outreach: Newcomer Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'6137224000 ext. 204','','','Services that cater to newcomers from various cultural, ethnic, and linguistic backgrounds.','','','',''),(75,'Action Housing','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(76,'Individual Counselling','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','','','','',''),(77,'Transitional Support','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Assists women in transition to a life free from violence by connecting them with necessary community services, such as housing, parenting support, educational and employment needs, legal matters and accompaniments, health and wellness services to ensure client’s transition needs are met.','','','',''),(78,'VAW Phase 1 Group','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,'','','','Open to all women who have experienced abused by a partner, whether you are in a relationship or not. Explores such topics as: the dynamics of abuse, the impacts of abuse, emotions, safety, building self-esteem, assertiveness skills, support networks and self-care.','','','',''),(79,'Wednesday Women Group','900 Merivale Rd','K1Z5Z8',45.3836718900,-75.7331933300,' 6137224000 ext. 297.','','','A bi-weekly support group for women. Topics identified by participants and focus on healthy living','','','',''),(82,'Summer Park Event','1500 Larose Ave','K1Z7X8',45.3767529500,-75.7405012400,'','','','In addition to the barbeque (includes halal hot dogs), there are snacks such as popcorn or cotton candy available, as well as coffee and juice.\n\nActivities change from year to year, but the list below will give you a good idea of what to expect:\n\nClimbing wall\nBouncy castle\nVarious games and activities\nArts and crafts\nT-shirt up-cycling\nPortrait artist or face painting\nReal fire truck','','','',' Friday, August 8, 2025'),(83,'Annual Plant, Seed and Yard Sale','W.E. Gowling School','K1Z7V6',45.3833511900,-75.7315488700,'','greening@carlingtoncommunity.org.','','','','','',''),(84,'Caldwell Family Centre ','6 Epworth Ave','K2G2L5',45.3516919000,-75.7397837600,'6137281800','','https://caldwellfamilycentre.ca/','Drop-in centre, food bank, meals and snacks, cooking programs, baby supplies and toy library for kids 1-4 years, school backpack program, after-school program, summer day camp, clothing program, sewing program.','','English/Franch','','all programs are closing for the day as of 11:30 am on Friday April 11th. Note that the Food Bank will close at 11am.'),(85,'Carlington Community Connection','1465 Caldwell Ave Unit 102','K1Z8L9',45.3728286700,-75.7364184100,'6137289933','','http://www.carlingtonconnection.com/','Range of hospitality and arts-based programs for Carlington residents, daily drop-in (Monday to Friday), cooking classes, special-interest classes and groups, pastoral care.','','','','Monday to Wednesday, Friday - 10:00AM - 11:30AM \nSaturday - 10:30AM - 12:30PM  '),(86,'Ottawa Mission Food Truck','1180 Shillington Ave','K1Z7Z4\n',45.3815218200,-75.7265243900,'','','','','','','',''),(87,'Alexander Community Centre','960 Silver Street','K1Z6H5',45.3806998600,-75.7313902800,'6137988978','acc@ottawa.ca','','The Alexander Community Centre offers a wide range of programs for children, youth and adults. We offer a variety of rooms to rent, each with a 46 inch flat screen television and surround sound system. Our spacious main hall seats 100 and has an attached kitchen.','','','The City of Ottawa has hundreds of indoor and outdoor spaces suitable for special events, meetings, sports, and gatherings of all kinds.','Sunday :Closed\nMonday :9:00 am - 5:30 pm\nTuesday :9:00 am - 5:30 pm\nWednesday :9:00 am - 5:30 pm\nThursday :9:00 am - 5:30 pm\nFriday :9:00 am - 5:30 pm\nSaturday :Closed'),(88,'Carlington Recreation Centre','1520 Caldwell Avenue','K1Z8H5',45.3750947100,-75.7381384700,'6137988920','','','','','','',''),(109,'Bike Repair Station','960 Silver St','K1Z6H5',45.3806998600,-75.7313902800,'6137988978','','','','','','',''),(110,'Communauto (car-sharing)','1274 Carling Avenue','K1Z7K8',45.3859988900,-75.7329975500,'','','https://ontario.communauto.com/','When you join Communauto, you gain access to a fleet of hundreds of vehicles that can be rented at low cost for a few minutes, an hour, a day, or longer!\nAccess a vehicle for as little as 45?/min, $4.50/hour, $35/day, or $195/week with our Value plan. ','','','',''),(111,'Pet Resource Bank Ottawa','490 Didak Dr','K7S3G7',45.4326220093,-76.3392407213,'6136230916','','https://petresourcebankottawa.com/','Keeps people and their pets together during difficult times, services include: food,  information, supplies and grooming, etc.','','','',''),(113,'Ottawa Outdoor Gear Library','211 Bronson Avenue','K2A2E1',45.4138734000,-75.7064243500,'','ottawaoutdoorgearlibrary@gmail.com','https://ottawaoutdoorgearlibrary.com/','To respond to barriers experienced by racialized and marginalized communities to nature-based experiences, land-based programming, outdoor recreation, and the associated mental and physical health benefits derived from time outside.','','English/French','','Mon\n\nClosed\n\nTue Closed\n\nWed Closed\n\nThu\n\nClosed\n\nFri\n\nClosed\n\nSat\n\nClosed\n\nSun\n\nClosed\n\n '),(114,'Ottawa Tool Library','877A Boyd Avenue','K2A 2E2',45.3761150100,-75.7501085000,'6138680178','','','','','','','Mon Closed\n\nTue Closed\n\nWed Closed\n\nThu Closed\n\nFri Closed\n\nSat Closed\n\nSun Closed\n');
/*!40000 ALTER TABLE `asset_temp_0327` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `draftId` int DEFAULT NULL COMMENT 'reference to assetDraft',
  `parentAssetId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL COMMENT 'asset name',
  `cityCode` int DEFAULT NULL COMMENT 'asset location city',
  `address` varchar(500) DEFAULT NULL COMMENT 'asset location address',
  `postCode` varchar(10) DEFAULT NULL COMMENT 'asset postcode',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT 'longitude',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT 'latitude',
  `isVolunOpp` bit(1) DEFAULT b'0' COMMENT 'if is volunteer Oppoetunities',
  `volunOppText` varchar(500) DEFAULT NULL COMMENT 'volunteer Opportunities remark',
  `phoneNumber` varchar(500) DEFAULT NULL COMMENT 'contractor phoneNumbe',
  `email` varchar(500) DEFAULT NULL COMMENT 'contractor email',
  `website` varchar(500) DEFAULT NULL COMMENT 'website url',
  `isWheelchairAcc` bit(1) DEFAULT b'0' COMMENT 'if has wheelchair Accessibility',
  `languagesOffered` varchar(150) DEFAULT NULL COMMENT 'languages offered option (English/French/Bilingual)',
  `scheduleType` varchar(150) DEFAULT NULL,
  `registrationNote` varchar(500) DEFAULT NULL,
  `scheduleNote` varchar(500) DEFAULT NULL,
  `socialWorkerOnlyNote` varchar(1500) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL COMMENT 'remark',
  `isEnable` bit(1) DEFAULT b'1' COMMENT 'is enable or not',
  `hasChildren` bit(1) DEFAULT b'0',
  `format` varchar(100) DEFAULT NULL,
  `transportation` varchar(500) DEFAULT NULL,
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastUpdateBy` int DEFAULT NULL COMMENT 'last updated by user(id)',
  `lastUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated date',
  PRIMARY KEY (`id`),
  KEY `FK_assets_cityCode` (`cityCode`),
  KEY `FK_assets_createdBy` (`createdBy`),
  KEY `FK_assets_draftId` (`draftId`),
  KEY `FK_assets_lastupdateBy` (`lastUpdateBy`),
  KEY `FK_assets_parentAssetId` (`parentAssetId`),
  KEY `idx_isEnable` (`isEnable`),
  KEY `idx_isVolunOpp` (`isVolunOpp`),
  FULLTEXT KEY `fulltext_name` (`name`),
  FULLTEXT KEY `fulltext_description_social` (`description`,`socialWorkerOnlyNote`),
  FULLTEXT KEY `fulltext_schedule_registration_etc` (`scheduleNote`,`registrationNote`,`volunOppText`,`transportation`,`format`,`languagesOffered`),
  FULLTEXT KEY `fulltext_website_address_email` (`website`,`address`,`email`),
  CONSTRAINT `FK_assets_cityCode` FOREIGN KEY (`cityCode`) REFERENCES `cityOptions` (`code`) ON DELETE SET NULL,
  CONSTRAINT `FK_assets_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_assets_draftId` FOREIGN KEY (`draftId`) REFERENCES `assetsDraft` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_assets_lastupdateBy` FOREIGN KEY (`lastUpdateBy`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_assets_parentAssetId` FOREIGN KEY (`parentAssetId`) REFERENCES `assets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='asset table, include all kind of asset: facility, service, p';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--
-- ORDER BY:  `id`

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` (`id`, `draftId`, `parentAssetId`, `name`, `cityCode`, `address`, `postCode`, `longitude`, `latitude`, `isVolunOpp`, `volunOppText`, `phoneNumber`, `email`, `website`, `isWheelchairAcc`, `languagesOffered`, `scheduleType`, `registrationNote`, `scheduleNote`, `socialWorkerOnlyNote`, `description`, `isEnable`, `hasChildren`, `format`, `transportation`, `createdBy`, `createDate`, `lastUpdateBy`, `lastUpdateDate`) VALUES (1,NULL,NULL,'Carlington Community Health Center',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0',NULL,'6137224000',NULL,'http://carlingtonchc.com/',_binary '','English','00001',NULL,NULL,NULL,'Carlington Community Health Center',_binary '',_binary '',NULL,NULL,NULL,NULL,NULL,'2025-04-07 19:50:19'),(2,NULL,1,'Baby friendly initiative',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0',NULL,'6137224000',NULL,'http://carlingtonchc.com/',_binary '','English','00001',NULL,NULL,NULL,NULL,_binary '',_binary '\0',NULL,NULL,NULL,NULL,NULL,'2025-04-07 19:50:19'),(4,NULL,1,'Prenatal and Breastfeeding support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','N/A','6137224000 ext. 246',' breastfeeding@carlingtonchc.com','',_binary '\0','English',NULL,'',' Every 2nd Thursday from 4:00 p.m. to 6:00 p.m',NULL,'Exclusive breastfeeding is important for your child’s health. Learn alongside other expectant parents in this informal virtual session. Come with your questions and get ready to learn! Hosted by Carlington’s Lactation Consultant. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(5,NULL,1,'Family and Parenting Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','N/A','6137224000 ext. 203','EarlyON@carlingtonchc.com','',_binary '\0','English',NULL,'Join our qualified staff for a variety of child development and parenting topics offered in an online workshop format.  For families with children 0-6 years','N/A',NULL,'One-on-one consultation available with Family Support worker, as well as information, referrals and support regarding parenting and pregnancy. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(6,NULL,1,'School and Readiness Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 322','EarlyON@carlingtonchc.com','',_binary '\0','English',NULL,'','',NULL,'After School Program,Backpack Adventures, Summer SWAG',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(7,NULL,1,'Annavale Headstart Nursery School',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(8,NULL,1,'Youth Programs',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','https://carlingtonchc.com/programs-and-services/families/youth-programs/',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(9,NULL,1,'Primary Health Care',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137222161','','https://carlingtonchc.com/programs-and-services/health-services/primary-health-care/medical-appointment-request/',_binary '\0','English',NULL,'','',NULL,'Our Primary Health Care team consists of an interdisciplinary group of dedicated professionals that includes physicians, nurse practitioners, nurses, a dietitian, respiratory therapist, chiropodist and foot care nurses.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(10,NULL,1,'After Hours On Call Services',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137875551','','',_binary '\0','English',NULL,'You can access the service by calling 613-787-5551. When unavailable, call Telehealth Ontario at 1-866-797-0000.','Monday to Friday until 8:00 p.m. and Weekends/Holidays from 9:00 a.m. to 5:00 p.m. ',NULL,'The After Hours On-Call Service is for sudden and unexpected illness that cannot wait until the next clinic day.If you are a registered primary care client and require medical advice that cannot wait until the office is next open.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(11,NULL,1,'Lung Health Care',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137222161','','',_binary '\0','English',NULL,'','',NULL,'Primary healthcare providers can refer clients to this program who have chronic lung disease such as asthma and COPD. A registered respiratory therapist assesses and evaluated the clients and assists them in maintaining optimal lung health',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(12,NULL,1,'Foot Care',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Our staff includes a certified chiropodist and foot care nurse. By appointment only.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(13,NULL,1,'Immunization',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Vaccinations are available by appointment only for registered clients of the Clinic as per the Ministry of Health and Long Term Care and Ottawa Public Health guidelines. Seasonal flu shot clinics will operate for Centre clients according to Ottawa Public Health guidelines. Dates and times are posted when available.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(14,NULL,1,'Dental Screenings',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','https://www.ottawapublichealth.ca/Common/PageNotFound.aspx?aspxerrorpath=/en/public-health-topics/access-to-dental-care.aspx',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(15,NULL,1,'Living Well with a Chronic Condition',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'A six week workshop series offered for Chronic Disease Self-Management and Chronic Pain Self-Management. Workshops are designed to help manage a chronic condition to live a healthy life.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(16,NULL,1,'Birth Control',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Information and counselling on birth control options and oral contraception purchase programs provided by appointment only for registered clients of the medical clinic.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(17,NULL,1,'Nutrition Counselling',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6132383722','','',_binary '\0','English',NULL,'','',NULL,'Individual nutrition counselling is available in the primary health care clinic.  Clients of the medical clinic can ask their health care provider for a referral.  Other clients who live in the Carlington catchment area may be able to access this services based on availability and reason for the request',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(18,NULL,1,'Assertive Community Treatment Team (ACTT)',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(19,NULL,1,'Crisis and Intake',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','Monday: 1:00pm – 3:30pm\nTuesday: 1:00pm – 3:30pm\nWednesday: 1:00pm – 3:30pm\nFriday: 1:00pm – 3:30pm',NULL,'Intake Counsellor offers immediate help with personal crisis and support with food security, referrals and practical assistance. Access to our emergency food cupboard provided to those within our service area.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(20,NULL,1,'Counselling',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(21,NULL,1,'Violence Against Women',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Available to women who are experiencing or have experienced partner abuse. We operate from a feminist perspective, which includes empowerment, support, advocacy, while maintaining a nonjudgmental approach. Some of the topics explored in sessions are the cycle of violence, elements of power and control, warning signs, impacts of abuse on women and children, healthy relationships and many more.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(22,NULL,1,'Bike Repair Clinic',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Cycling is a healthy, fun and low-impact form of exercise for all ages. Easy to fit into your daily routine by riding to shops, school or work. Seasonal program offered in the summer.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(23,NULL,1,'Brain Bingo!',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','',' 6137224000 ext. 204','','',_binary '\0','English',NULL,'','Tuesdays from 2-4pm',NULL,'Bingo, health trivia and prizes! Bring your friends or make new friends with social time for people aged 55+. Free to join, everyone welcome. Tea and coffee provided.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(24,NULL,1,'Cooking for kids',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 492','','',_binary '\0','English',NULL,'','',NULL,'A group that meets twice a month to cook for children in an after-school program and enjoy coffee and snacks together after.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(25,NULL,1,'English Second Language Conversation Group',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','Twice weekly on Tuesdays and Thursdays, 12:00 p.m. to 1:00 p.m',NULL,'Looking to improve your English while you are staying at home? Looking for a sense of community and connection? Join the conversation!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(26,NULL,1,'Mission Food Truck',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 299.','','',_binary '\0','English',NULL,'','',NULL,'In partnership with The Ottawa Mission, we’re providing warm and nutritious meals in your community!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(27,NULL,1,'Healthful Food Working Group',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Interested in food security and vegetable gardening in the community? Get involved!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(28,NULL,1,'Income Tax Clinic',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','https://carlingtonchc.com/taxclinic/',_binary '\0','English',NULL,'Book an appointment:https://carlingtonchc.com/taxclinic/','',NULL,'Free tax preparation clinic in partnership with Canada Revenue Agency (CRA). Volunteers complete tax returns for eligible individuals with a modest income and simple tax situation who live in the Carlington catchment area. Seasonal program from February to April.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(29,NULL,1,'Senior Chair Exercises',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'In partnership with Family Physio, offering free chair exercises for people aged 55+ to increase mobility and build strength and balance. Designed for all skill levels, everyone welcome! Mondays, Wednesdays, Fridays in-person streaming and online. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(30,NULL,1,'Millennium Learning Centre',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'The Millenium Learning Centre is available to the general public to access computers, gain computer skills, and access the Internet in a supportive environment.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(31,NULL,1,'Safety and Security Wokring Group',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(32,NULL,1,'Summer Concert Series',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext.204','','',_binary '\0','English',NULL,'','',NULL,'Enjoy the warm weather together at an outdoor concert in your community.  Various days and locations throughout the summer.  Everyone is welcome!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(33,NULL,1,'Van Lang Community Kitchen and Meal',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(34,NULL,1,'Women in the wild',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext.328 ','','',_binary '\0','English',NULL,'','',NULL,'Participating in outdoor recreational activities provides many physical and emotional benefits. Locations throughout Ottawa-Gatineau.  Transportation provided.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(35,NULL,1,'Workshops',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(36,NULL,1,'Community Newsletter',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','https://ochc.us15.list-manage.com/subscribe?u=958e0c00b3a752634e50785fb&id=1b572631e0',_binary '\0','English',NULL,'','',NULL,'Subscribe to Carlington’s weekly newsletter filled with upcoming events and activities in the community!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(37,NULL,NULL,'Good Food on the Move',1,'1290 Coldrey Avenue','K1Z0C4\n',-75.733865,45.383441,_binary '\0','','6137450073 ext. 122','','https://www.ottawagoodfoodbox.ca/faq',_binary '\0','English',NULL,'','Order fresh fruit and vegetables online weekly from Wednesday 9:00 a.m. to Monday 9:00 a.m.  Pick up your order the following Wednesday at 2:00 p.m',NULL,'Our mission is to make fruits and vegetables more accessible and affordable for Ottawa community members facing barriers to accessing fresh food.\nWe believe that everyone has the right to fresh, healthy food and that food security is possible through local unity.\nWe provide safe, reliable and convenient ways to access fresh and nutritious food, right in your community.?',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(38,NULL,NULL,'Grocery Boxes',1,'6 Epworth Ave','K2G2L5',-75.739837,45.351722,_binary '\0','','6137281800',NULL,'',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(39,NULL,1,'Pregnant in Ottawa',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','breastfeeding@carlingtonchc.org','',_binary '\0','English',NULL,'','',NULL,'Free prenatal classes open to all Ottawa residents who are pregnant. Join through the Facebook Group or email us for details.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(40,NULL,1,'Prenatal Breastfeeding Info Session',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','breastfeeding@carlingtonchc.org','',_binary '\0','English',NULL,'REGISTER:\n2nd Thursday 4:00-6:00 p.m.','Every 2nd Thursday from 4:00 p.m. to 6:00 p.m',NULL,'Exclusive breastfeeding is important for your child’s health. Learn alongside other expectant parents in this informal virtual session. Come with your questions and get ready to learn! ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(41,NULL,1,'Breastfeeding and Infant Feeding Clinic',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','breastfeeding@carlingtonchc.org','',_binary '\0','English',NULL,'','',NULL,'For women and families who would like 1:1 information on general infant feeding, and/or breastfeeding support.  Thursdays 1-3pm.  Free 30 min consultations. No appointment needed. Please note that every effort will be made to accommodate families attending, but there are limited spaces. \n\nPlan to arrive at the beginning of the clinic to register onsite, to avoid disappointment.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(42,NULL,1,'Individual Lactation Consultations (Prenatal and Postnatal)',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','breastfeeding@carlingtonchc.org','',_binary '\0','English',NULL,'','',NULL,'How to book your Lactation Consultation with Janice at Carlington:\n\nPlease email breastfeeding@carlingtonchc.org with the following:\n\nyour full name and date of birth,\nbaby full name and date of birth,\npreferred email and phone number\nbrief description of your lactation needs',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(43,NULL,1,'Q & A with the Lactation Consultant',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Join other mothers (and mothers-to-be) for an informal VIRTUAL session every Tuesday 4-5:00 pm.\nCome with your questions and learn from other mothers’ questions!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(44,NULL,1,'High-risk pregnancy: Roadmap for successful breastfeeding',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','',' breastfeeding@carlingtonchc.org','',_binary '\0','English',NULL,'','',NULL,'Are you experiencing a high risk pregnancy?  Worried about breastfeeding success?\n\nJoin our Lactation Consultant for a VIRTUAL Prenatal Information Session designed for families who are experiencing high risk pregnancy.\n\nLearn about specific strategies to improve your breastfeeding success.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(45,NULL,1,'Buns in the Oven',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 246','','',_binary '\0','English',NULL,'','',NULL,'A friendly prenatal support program for those who are pregnant and are interested in learning about pregnancy and nutrition. Connections to a lactation consultant.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(46,NULL,1,'Individual Family and Parenting Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 246 ','','',_binary '\0','English',NULL,'','',NULL,'One-on-one consultation available with Family Support worker, as well as information, referrals and support regarding parenting and pregnancy. By appointment only. In person and online. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(47,NULL,1,'Parenting Newborns and Infants',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(48,NULL,1,'Snack and Chat',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 246.','','',_binary '\0','English',NULL,'','',NULL,'Health and parenting program for women interested in learning about parenting, health issues, nutrition. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(49,NULL,1,'EarlyON Workshops',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','EarlyON@carlingtonchc.com','https://carlingtonchc.com/programs-and-services/families/family-and-parenting-support/',_binary '\0','English',NULL,'','',NULL,'A variety of short programs and workshops focused on child development and parenting topics, offered throughout the year, some virtual, some in-person when possible.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(50,NULL,1,'Supporting Neighbourhood Caregivers',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(51,NULL,1,'Positive Discipline',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','EarlyON@carlingtonchc.com','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(52,NULL,1,'Nobody\'s Perfect',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(53,NULL,1,'EarlyON Child and Family Centre',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','EarlyON@carlingtonchc.com','',_binary '\0','English',NULL,'If you are having difficulty finding program, registering, or have questions, email us at EarlyON@carlingtonchc.com','Family Math: Support numeracy literacy through play! For families with children 3-4yo,  getting ready to start Junior Kindergarten!  6-week program, meeting once a week.\n\nBackpack Adventures: Support early literacy through play. For families with children 3-4yo, getting ready to start Junior Kindergarten!  6-week program, meeting once a week.',NULL,'EarlyON Child and Family Centres provide opportunities for children from birth to six years of age to participate in play and inquiry-based programs, and support parents and caregivers in their roles. We offer safe and welcoming environments open to all families across Ontario, with qualified professionals and quality programs. Families and caregivers will be able to find support, make personal connections and access a network of resources.  At Carlington CHC, we are to please to welcome you and your little ones at any of our programs.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(54,NULL,1,'EarlyON Newsletter',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(55,NULL,1,'EarlyON Playgroups',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','https://carlingtonchc.com/calendar/',_binary '\0','English',NULL,'','Registration via CALENDAR links or our EarlyON Newsletter.',NULL,'Join us in our beautiful new playroom and garden, featuring a natural, calming, and spacious play environment at our main site or join us in a community location near you. Join our Early Childhood Educators for stories, songs, arts and crafts, and funny dances! For children ages 0-6 years. Due to limited spots registration is encouraged. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(56,NULL,1,'EarlyON Virtual Programs',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','EarlyON@carlingtonchc.com','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(57,NULL,1,'EarlyON Playgroups in the Park',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(58,NULL,1,'Ask Us! EarlyON One-on One Parenting Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(60,NULL,1,'EarlyON Parenting Groups',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(61,NULL,1,'After School Program',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(62,NULL,1,'Backpack Adventures',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(63,NULL,1,'Summer SWAG',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6136973213','brwentambo@carlingtonchc.org','',_binary '\0','English',NULL,'','',NULL,'We provide:\n\nPreparation for High School Readiness\nFun Recreational Activities\nFieldtrips\nFundraiser Activities\nHigh School Volunteer Hours\nFood & Snacks & Much More!',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(64,NULL,1,'Students Will All Graduate (SWAG)',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 322.','','',_binary '\0','English',NULL,'','',NULL,'Carlington Community Health Centre and community partners are collectively working to address high dropout rates in the following four communities: Shillington, Debra Dynes, Bellevue/Caldwell and Parkwood Hills.\n\nThe Students Will All Graduate (SWAG) Program provides credit-based academic support, social recreation programming, mentoring and relationship building, and skill-based leadership programming. SWAG is offered by a team of Youth Workers, Ontario Certified Teachers and Volunteers 4 days a week throughout the school year',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(65,NULL,1,'Youth Drop-In',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 322','','',_binary '\0','English',NULL,'','',NULL,'A safe space for youth to come together, have fun, talk, participate in community activities, develop new skills and mostly, be themselves among friends.  Bellevue Community Centre.  Currently online due to COVID.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(66,NULL,1,'REDBLACKS Youth Mentorship Program',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(67,NULL,1,'Financial Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(68,NULL,1,'Crisis Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(69,NULL,1,'Housing Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(70,NULL,1,'Food Cupboard',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(71,NULL,1,'Baby Cupboard',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Supplies, support, information and referrals for infant-related concerns.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(73,NULL,1,'Youth Counselling (12-25 years of age)',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Counselling sessions are tailored to the individual needs of each youth and address common issues and concerns such as: anxiety and depression, grief and loss, anger management, family and peer relationship distress, 2SLGBTQ issues, self-esteem, and life transition difficulties.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(74,NULL,1,'Settlement Outreach: Newcomer Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','6137224000 ext. 204','','',_binary '\0','English',NULL,'','',NULL,'Services that cater to newcomers from various cultural, ethnic, and linguistic backgrounds.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(75,NULL,1,'Action Housing',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(76,NULL,1,'Individual Counselling',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(77,NULL,1,'Transitional Support',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Assists women in transition to a life free from violence by connecting them with necessary community services, such as housing, parenting support, educational and employment needs, legal matters and accompaniments, health and wellness services to ensure client’s transition needs are met.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(78,NULL,1,'VAW Phase 1 Group',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'Open to all women who have experienced abused by a partner, whether you are in a relationship or not. Explores such topics as: the dynamics of abuse, the impacts of abuse, emotions, safety, building self-esteem, assertiveness skills, support networks and self-care.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(79,NULL,1,'Wednesday Women Group',1,'900 Merivale Rd','K1Z5Z8',-75.733193,45.383672,_binary '\0','',' 6137224000 ext. 297.','','',_binary '\0','English',NULL,'','',NULL,'A bi-weekly support group for women. Topics identified by participants and focus on healthy living',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(82,NULL,NULL,'Summer Park Event',1,'1500 Larose Ave','K1Z7X8',-75.740501,45.376753,_binary '\0','','','','',_binary '\0','English',NULL,'',' Friday, August 8, 2025',NULL,'In addition to the barbeque (includes halal hot dogs), there are snacks such as popcorn or cotton candy available, as well as coffee and juice.\n\nActivities change from year to year, but the list below will give you a good idea of what to expect:\n\nClimbing wall\nBouncy castle\nVarious games and activities\nArts and crafts\nT-shirt up-cycling\nPortrait artist or face painting\nReal fire truck',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(83,NULL,NULL,'Annual Plant, Seed and Yard Sale',1,'W.E. Gowling School','K1Z7V6',-75.731549,45.383351,_binary '\0','','','greening@carlingtoncommunity.org.','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(84,NULL,NULL,'Caldwell Family Centre ',1,'6 Epworth Ave','K2G2L5',-75.739784,45.351692,_binary '\0','','6137281800','','https://caldwellfamilycentre.ca/',_binary '\0','English',NULL,'','all programs are closing for the day as of 11:30 am on Friday April 11th. Note that the Food Bank will close at 11am.',NULL,'Drop-in centre, food bank, meals and snacks, cooking programs, baby supplies and toy library for kids 1-4 years, school backpack program, after-school program, summer day camp, clothing program, sewing program.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(85,NULL,NULL,'Carlington Community Connection',1,'1465 Caldwell Ave Unit 102','K1Z8L9',-75.736418,45.372829,_binary '\0','','6137289933','','http://www.carlingtonconnection.com/',_binary '\0','English',NULL,'','Monday to Wednesday, Friday - 10:00AM - 11:30AM \nSaturday - 10:30AM - 12:30PM  ',NULL,'Range of hospitality and arts-based programs for Carlington residents, daily drop-in (Monday to Friday), cooking classes, special-interest classes and groups, pastoral care.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(86,NULL,NULL,'Ottawa Mission Food Truck',1,'1180 Shillington Ave','K1Z7Z4\n',-75.726524,45.381522,_binary '\0','','','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(87,NULL,NULL,'Alexander Community Centre',1,'960 Silver Street','K1Z6H5',-75.731390,45.380700,_binary '\0','','6137988978','acc@ottawa.ca','',_binary '\0','English',NULL,'The City of Ottawa has hundreds of indoor and outdoor spaces suitable for special events, meetings, sports, and gatherings of all kinds.','Sunday :Closed\nMonday :9:00 am - 5:30 pm\nTuesday :9:00 am - 5:30 pm\nWednesday :9:00 am - 5:30 pm\nThursday :9:00 am - 5:30 pm\nFriday :9:00 am - 5:30 pm\nSaturday :Closed',NULL,'The Alexander Community Centre offers a wide range of programs for children, youth and adults. We offer a variety of rooms to rent, each with a 46 inch flat screen television and surround sound system. Our spacious main hall seats 100 and has an attached kitchen.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(88,NULL,NULL,'Carlington Recreation Centre',1,'1520 Caldwell Avenue','K1Z8H5',-75.738138,45.375095,_binary '\0','','6137988920','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(109,NULL,NULL,'Bike Repair Station',1,'960 Silver St','K1Z6H5',-75.731390,45.380700,_binary '\0','','6137988978','','',_binary '\0','English',NULL,'','',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(110,NULL,NULL,'Communauto (car-sharing)',1,'1274 Carling Avenue','K1Z7K8',-75.732998,45.385999,_binary '\0','','','','https://ontario.communauto.com/',_binary '\0','English',NULL,'','',NULL,'When you join Communauto, you gain access to a fleet of hundreds of vehicles that can be rented at low cost for a few minutes, an hour, a day, or longer!\nAccess a vehicle for as little as 45?/min, $4.50/hour, $35/day, or $195/week with our Value plan. ',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(111,NULL,NULL,'Pet Resource Bank Ottawa',1,'490 Didak Dr','K7S3G7',-76.339241,45.432622,_binary '\0','','6136230916','','https://petresourcebankottawa.com/',_binary '\0','English',NULL,'','',NULL,'Keeps people and their pets together during difficult times, services include: food,  information, supplies and grooming, etc.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(113,NULL,NULL,'Ottawa Outdoor Gear Library',1,'211 Bronson Avenue','K2A2E1',-75.706424,45.413873,_binary '\0','','','ottawaoutdoorgearlibrary@gmail.com','https://ottawaoutdoorgearlibrary.com/',_binary '\0','English',NULL,'','Mon\n\nClosed\n\nTue Closed\n\nWed Closed\n\nThu\n\nClosed\n\nFri\n\nClosed\n\nSat\n\nClosed\n\nSun\n\nClosed\n\n ',NULL,'To respond to barriers experienced by racialized and marginalized communities to nature-based experiences, land-based programming, outdoor recreation, and the associated mental and physical health benefits derived from time outside.',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(114,NULL,NULL,'Ottawa Tool Library',1,'877A Boyd Avenue','K2A 2E2',-75.750109,45.376115,_binary '\0','','6138680178','','',_binary '\0','English',NULL,'','Mon Closed\n\nTue Closed\n\nWed Closed\n\nThu Closed\n\nFri Closed\n\nSat Closed\n\nSun Closed\n',NULL,'',_binary '',_binary '\0',NULL,NULL,NULL,'2025-03-29 02:40:09',NULL,'2025-04-07 19:50:19'),(864,1058,NULL,'Rental at W.E. Gowling Public School',1,'250 Anna Avenue','K1Z 7V6',-75.731778,45.382459,_binary '\0','',NULL,NULL,'https://ocdsb.ebasefm.com/rentals/catalogue/school_details/136|https://www.ocdsb.ca/family-community-support/community-use-of-schools/renting-a-facility|https://ocdsb.ebasefm.com/rentals/welcome',_binary '','English|French','','Fees are depend on the facility and category of the user. Request forms must be submitted online through eBase account. CUS requires a minimum of 5 business days to process a permit. ','Ottawa-Carleton District School Board space is available from mid-September to May 31 each year, excluding Winter Break, March Break and holiday long weekends.\nSports Fields are available from May 15 to October 30 and Ball Diamonds are available from May 1 to October 30.','','The Ottawa-Carleton District School Board is pleased to offer community groups the opportunity to book school facilities through a user-friendly online booking process.\nAvailable facilities at this school:\n- classrooms;\n- gymnasium;\n- gymnasium + stage;\n- library;\n- lobby;\n- parking lot;\n- sports field (track);',_binary '',_binary '\0',NULL,'bus 80: stop Merivale / Anna (to Baseline Rd) or Merivale / Coldrey (to Carling Ave);\nbuses 53, 114: stop Admiral / Anna (both sides);',2,'2025-03-20 17:03:18',2,'2025-03-23 22:31:04'),(1297,1310,NULL,'Conservative Synagogue Kehillat Beth Israel ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'kehillatbethisrael.com',_binary '','English|Hebrew','','KBI welcomes all to our regular programming.  Full membership in our kehillah means in addition to this programming, you are entitled to full pastoral support, voting rights at meetings, access to our High Holy Days, and burial rights in the KBI section of the Jewish Memorial Gardens. Additionally, full members receive all synagogue communication and are entitled to have life-cycle events take place at the synagogue.','','','Kehillat Beth Israel Congregation is a welcoming, egalitarian synagogue that promotes Conservative Judaism and its values through religious, educational and social activities. We combine traditional ritual practices with a strong commitment to diversity and inclusion. We welcome and involve in ritual matters all Jewish people, regardless of sexual orientation, gender identity/expression, race, or ability. We welcome non-Jews who want to learn about congregational life or who support family members who are Jewish. Lifecycle services are available for individuals and all types of families. People of all abilities regularly participate in our programs and services.\n\nOur core values embrace Torah study and Jewish literacy, social diversity and inclusion, righteousness through Tikkun Olam, and Jewish engagement and worship in a meaningful way.\n\nWe are committed to continuing as a traditional, halachically-based kehilla that is guided by Conservative rabbinical leadership. We are also committed to lay member participation as ritual leaders in all functions – torah reading, gabbaim, and ba’alei tfillot.\n\nOur congregation is vibrant and active, with members involved in Jewish and civic community institutions. We promote social action initiatives, such as operating the community’s Ottawa Kosher Food Bank. Our Hebrew supplementary school is open to the children of members and non-members alike.',_binary '',_binary '','On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:09',5,'2025-03-27 14:47:09'),(1298,1312,1297,'Kehillateinu (Junior Congregation) ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/',_binary '',NULL,'','','runs every other Shabbat morning in the Chapel, beginning at 10:30 AM.','','A service in Conservative Synagogue Kehillat Beth Israel. Kehillateinu (Junior Congregation) runs every other Shabbat morning in the Chapel, beginning at 10:30 AM. Children age 7-11 participate in a kids’ prayer service, learn about the weekly Torah portion, play games, and enjoy a fun, kid-friendly snack before leading the concluding prayers in the main sanctuary.',_binary '',_binary '\0','Group|Drop-in|On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-27 14:47:10'),(1299,1314,1297,'Personal study and ritual learning for Jewish adults.',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/learn/adult-education/',_binary '',NULL,'','','','','A service in Conservative Synagogue Kehillat Beth Israel. Kehillat Beth Israel is proud to offer a full slate of learning opportunities for our diverse and engaged community. Topics run the gamut from Torah study, to issues of local interest, to developments affecting Israel and the wider world. We are proud to welcome speakers of national and international renown and to provide unique and dynamic programs open to the entire Jewish community of Ottawa. Cantor Green regularly runs classes and provides opportunities for personal study and ritual learning. ',_binary '',_binary '\0',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-27 14:47:10'),(1300,1315,1297,'Ottawa Kosher Food Bank',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '','',NULL,NULL,'https://okfb.wordpress.com|https://www.kehillatbethisrael.com/welcome/ottawa-kosher-food-bank/',_binary '','English|Hebrew','','The OKFB serves members of the Ottawa Jewish community in need of assistance. Most of our clients are referred to us from Jewish Family Services. We currently serve over 120 families each month.','Our office hours are Monday, Wednesday and Thursday from 10:00 AM – 4:00 PM, and Friday from 10:00 AM to 2:00 PM.','','A service in Conservative Synagogue Kehillat Beth Israel. The Ottawa Kosher Food Bank (OKFB) is located inside of Kehillat Beth Israel synagogue at 1400 Coldrey Avenue in Ottawa.\n\nWe are dedicated to providing healthful kosher food to Ottawa families who are in need. We are the only kosher food bank in Ottawa.\n\nThe OKFB is run by one part-time manager (Linda Prizant) and a team of dedicated volunteers.\n',_binary '',_binary '\0',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-27 14:47:10'),(1301,1313,1297,'Family Jewish Holidays Activities',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/',_binary '',NULL,'','','Check information on website, updated regularly','','A service in Conservative Synagogue Kehillat Beth Israel. High Holidays\nOur High Holy Day programming focuses on bringing the huge concepts of Rosh Hashanah and Yom Kippur down to a kid-friendly level. In addition to Junior Congregation Services for all ages and Babysitting, KBI’s High Holy Day Family Services welcome kids (0-6) and their parents/caregivers into our vibrant worship community. These programs include learning, praying, and games, creating memorable and meaningful holiday experiences for all. Enjoy a moving holiday experience together with your children in a service geared to their needs, interests, and attention spans!\n\nOther Holiday Programming\nIn celebration of Jewish holidays, we run fun, engaging, and creative programs for parents and kids. Past programs have included: Sukkah Decorating, Family Hannukah Parties, Non-Traditional Hamentaschen Baking for Purim, Chocolate Seders for Passover, and Cheesecake Making for Shavuot. Our programs are hands-on, dynamic, and crafted with the needs of parents and young children in mind. You can expect fun family activities, holiday crafts, delicious food, and the opportunity to meet other families in the KBI community.',_binary '',_binary '\0','Scheduled event','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-27 14:47:10'),(1302,1316,1297,'Malca Pass Library',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '','','6137283501232','library@kehillatbethisrael.com','https://www.kehillatbethisrael.com/welcome/malca-pass-library/|https://gfl.follettdestiny.ca',_binary '\0',NULL,'','','The library, staffed by helpful volunteers, is open on Thursdays from 10:30 a.m. to 2:30 p.m. You may call the library or write to our email to request a book, DVD or CD. The item can be picked up at the shul office during its hours of operation: Monday-Thursday 8:30 a.m. – 4:30 p.m. & Friday 8:30 a.m. – 2:00 p.m.','','A service in Conservative Synagogue Kehillat Beth Israel. Kehillat Beth Israel is proud to offer free access to the exceptional Malca Pass Library, an impressive collection of texts, DVDs and music CDs in almost every area of Judaica. Books include a large up-to-date collection of fiction on Jewish themes or by Jewish authors as well as non-fiction materials such as biography, art, Jewish religious practice, holy days, history and food. Named in memory of a dedicated Agudath Israel Congregation Sisterhood President and volunteer, the library has established a vast collection over its 50+ year history.\n\nAn associated program, the Malca Pass Library Book Discussion Group meets periodically throughout the year. Both the library and the book group are open to the entire Ottawa community.\n\nThe library’s catalog is available online.\n',_binary '',_binary '\0',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-31 02:22:00'),(1303,1311,1297,'Tot Shabbat ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/',_binary '',NULL,'','','Twice a month on Saturday mornings','','A service in Conservative Synagogue Kehillat Beth Israel. Twice a month on Saturday mornings we offer Tot Shabbat – tots (0-6) and their parents/caregivers join together in our Family Lounge for songs, prayers, stories, and a healthy light lunch. Families love this opportunity to connect with their kids and introduce them to the joys of synagogue life. Tots enjoy joining the older kids on the bimah in the main sanctuary for the end of the service.',_binary '',_binary '\0','Drop-in|Group|On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey',5,'2025-03-27 14:47:10',5,'2025-03-27 14:47:10');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assetsDraft`
--

DROP TABLE IF EXISTS `assetsDraft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assetsDraft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetId` int DEFAULT NULL COMMENT 'reference to forma, just for updatel',
  `name` varchar(255) NOT NULL COMMENT 'asset name',
  `cityCode` int DEFAULT NULL COMMENT 'asset location city',
  `address` varchar(500) DEFAULT NULL COMMENT 'asset location address',
  `postCode` varchar(10) DEFAULT NULL COMMENT 'asset postcode',
  `longitude` decimal(10,6) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `isVolunOpp` bit(1) DEFAULT b'0' COMMENT 'if is volunteer Oppoetunities',
  `volunOppText` varchar(500) DEFAULT NULL,
  `phoneNumber` varchar(500) DEFAULT NULL COMMENT 'contractor phoneNumbe',
  `email` varchar(500) DEFAULT NULL COMMENT 'contractor email',
  `website` varchar(500) DEFAULT NULL COMMENT 'website url',
  `registrationNote` varchar(500) DEFAULT NULL,
  `scheduleNote` varchar(500) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL COMMENT 'Pending; Approved; Rejectedt',
  `createdEmail` varchar(100) DEFAULT NULL COMMENT 'created by user(email)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `hasChildren` bit(1) DEFAULT b'0',
  `parentAssetDraftId` int DEFAULT NULL,
  `isWheelchairAcc` bit(1) DEFAULT b'0',
  `languagesOffered` varchar(150) DEFAULT NULL,
  `scheduleType` varchar(150) DEFAULT NULL,
  `socialWorkerOnlyNote` varchar(1500) DEFAULT NULL,
  `format` varchar(100) DEFAULT NULL,
  `transportation` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_assetsDraft_assetId` (`assetId`),
  KEY `FK_assetsDraft_cityCode` (`cityCode`),
  KEY `FK_assetsDraft_mainAssetDraftId` (`parentAssetDraftId`),
  CONSTRAINT `FK_assetsDraft_assetId` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`),
  CONSTRAINT `FK_assetsDraft_cityCode` FOREIGN KEY (`cityCode`) REFERENCES `cityOptions` (`code`),
  CONSTRAINT `FK_assetsDraft_mainAssetDraftId` FOREIGN KEY (`parentAssetDraftId`) REFERENCES `assetsDraft` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1466 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='asset table, include all kind of asset: facility, service, p';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assetsDraft`
--
-- ORDER BY:  `id`

LOCK TABLES `assetsDraft` WRITE;
/*!40000 ALTER TABLE `assetsDraft` DISABLE KEYS */;
INSERT INTO `assetsDraft` (`id`, `assetId`, `name`, `cityCode`, `address`, `postCode`, `longitude`, `latitude`, `isVolunOpp`, `volunOppText`, `phoneNumber`, `email`, `website`, `registrationNote`, `scheduleNote`, `description`, `status`, `createdEmail`, `createDate`, `hasChildren`, `parentAssetDraftId`, `isWheelchairAcc`, `languagesOffered`, `scheduleType`, `socialWorkerOnlyNote`, `format`, `transportation`) VALUES (1058,NULL,'Rental at W.E. Gowling Public School',1,'250 Anna Avenue','K1Z 7V6',-75.731778,45.382459,_binary '\0','',NULL,NULL,'https://ocdsb.ebasefm.com/rentals/catalogue/school_details/136|https://www.ocdsb.ca/family-community-support/community-use-of-schools/renting-a-facility|https://ocdsb.ebasefm.com/rentals/welcome','Fees are depend on the facility and category of the user. Request forms must be submitted online through eBase account. CUS requires a minimum of 5 business days to process a permit. ','Ottawa-Carleton District School Board space is available from mid-September to May 31 each year, excluding Winter Break, March Break and holiday long weekends.\nSports Fields are available from May 15 to October 30 and Ball Diamonds are available from May 1 to October 30.','The Ottawa-Carleton District School Board is pleased to offer community groups the opportunity to book school facilities through a user-friendly online booking process.\nAvailable facilities at this school:\n- classrooms;\n- gymnasium;\n- gymnasium + stage;\n- library;\n- lobby;\n- parking lot;\n- sports field (track);','pending','','2025-03-16 23:44:22',_binary '\0',NULL,_binary '','English|French','','',NULL,'bus 80: stop Merivale / Anna (to Baseline Rd) or Merivale / Coldrey (to Carling Ave);\nbuses 53, 114: stop Admiral / Anna (both sides);'),(1310,NULL,'Conservative Synagogue Kehillat Beth Israel ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'kehillatbethisrael.com','KBI welcomes all to our regular programming.  Full membership in our kehillah means in addition to this programming, you are entitled to full pastoral support, voting rights at meetings, access to our High Holy Days, and burial rights in the KBI section of the Jewish Memorial Gardens. Additionally, full members receive all synagogue communication and are entitled to have life-cycle events take place at the synagogue.','','Kehillat Beth Israel Congregation is a welcoming, egalitarian synagogue that promotes Conservative Judaism and its values through religious, educational and social activities. We combine traditional ritual practices with a strong commitment to diversity and inclusion. We welcome and involve in ritual matters all Jewish people, regardless of sexual orientation, gender identity/expression, race, or ability. We welcome non-Jews who want to learn about congregational life or who support family members who are Jewish. Lifecycle services are available for individuals and all types of families. People of all abilities regularly participate in our programs and services.\n\nOur core values embrace Torah study and Jewish literacy, social diversity and inclusion, righteousness through Tikkun Olam, and Jewish engagement and worship in a meaningful way.\n\nWe are committed to continuing as a traditional, halachically-based kehilla that is guided by Conservative rabbinical leadership. We are also committed to lay member participation as ritual leaders in all functions – torah reading, gabbaim, and ba’alei tfillot.\n\nOur congregation is vibrant and active, with members involved in Jewish and civic community institutions. We promote social action initiatives, such as operating the community’s Ottawa Kosher Food Bank. Our Hebrew supplementary school is open to the children of members and non-members alike.','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '',NULL,_binary '','English|Hebrew','','','On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1311,NULL,'Tot Shabbat ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/','','Twice a month on Saturday mornings','A service in Conservative Synagogue Kehillat Beth Israel. Twice a month on Saturday mornings we offer Tot Shabbat – tots (0-6) and their parents/caregivers join together in our Family Lounge for songs, prayers, stories, and a healthy light lunch. Families love this opportunity to connect with their kids and introduce them to the joys of synagogue life. Tots enjoy joining the older kids on the bimah in the main sanctuary for the end of the service.','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '',NULL,'','','Drop-in|Group|On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1312,NULL,'Kehillateinu (Junior Congregation) ',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/','','runs every other Shabbat morning in the Chapel, beginning at 10:30 AM.','A service in Conservative Synagogue Kehillat Beth Israel. Kehillateinu (Junior Congregation) runs every other Shabbat morning in the Chapel, beginning at 10:30 AM. Children age 7-11 participate in a kids’ prayer service, learn about the weekly Torah portion, play games, and enjoy a fun, kid-friendly snack before leading the concluding prayers in the main sanctuary.','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '',NULL,'','','Group|Drop-in|On site','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1313,NULL,'Family Jewish Holidays Activities',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/engage/family-programming/','','Check information on website, updated regularly','A service in Conservative Synagogue Kehillat Beth Israel. High Holidays\nOur High Holy Day programming focuses on bringing the huge concepts of Rosh Hashanah and Yom Kippur down to a kid-friendly level. In addition to Junior Congregation Services for all ages and Babysitting, KBI’s High Holy Day Family Services welcome kids (0-6) and their parents/caregivers into our vibrant worship community. These programs include learning, praying, and games, creating memorable and meaningful holiday experiences for all. Enjoy a moving holiday experience together with your children in a service geared to their needs, interests, and attention spans!\n\nOther Holiday Programming\nIn celebration of Jewish holidays, we run fun, engaging, and creative programs for parents and kids. Past programs have included: Sukkah Decorating, Family Hannukah Parties, Non-Traditional Hamentaschen Baking for Purim, Chocolate Seders for Passover, and Cheesecake Making for Shavuot. Our programs are hands-on, dynamic, and crafted with the needs of parents and young children in mind. You can expect fun family activities, holiday crafts, delicious food, and the opportunity to meet other families in the KBI community.','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '',NULL,'','','Scheduled event','buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1314,NULL,'Personal study and ritual learning for Jewish adults.',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '\0','','6137283501',NULL,'https://www.kehillatbethisrael.com/learn/adult-education/','','','A service in Conservative Synagogue Kehillat Beth Israel. Kehillat Beth Israel is proud to offer a full slate of learning opportunities for our diverse and engaged community. Topics run the gamut from Torah study, to issues of local interest, to developments affecting Israel and the wider world. We are proud to welcome speakers of national and international renown and to provide unique and dynamic programs open to the entire Jewish community of Ottawa. Cantor Green regularly runs classes and provides opportunities for personal study and ritual learning. ','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '',NULL,'','',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1315,NULL,'Ottawa Kosher Food Bank',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '','',NULL,NULL,'https://okfb.wordpress.com|https://www.kehillatbethisrael.com/welcome/ottawa-kosher-food-bank/','The OKFB serves members of the Ottawa Jewish community in need of assistance. Most of our clients are referred to us from Jewish Family Services. We currently serve over 120 families each month.','Our office hours are Monday, Wednesday and Thursday from 10:00 AM – 4:00 PM, and Friday from 10:00 AM to 2:00 PM.','A service in Conservative Synagogue Kehillat Beth Israel. The Ottawa Kosher Food Bank (OKFB) is located inside of Kehillat Beth Israel synagogue at 1400 Coldrey Avenue in Ottawa.\n\nWe are dedicated to providing healthful kosher food to Ottawa families who are in need. We are the only kosher food bank in Ottawa.\n\nThe OKFB is run by one part-time manager (Linda Prizant) and a team of dedicated volunteers.\n','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '','English|Hebrew','','',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1316,NULL,'Malca Pass Library',1,'1400 Coldrey Avenue','K1Z 7P9',-75.739140,45.380575,_binary '','','6137283501232|222','library@kehillatbethisrael.com','https://www.kehillatbethisrael.com/welcome/malca-pass-library/|https://gfl.follettdestiny.ca','','The library, staffed by helpful volunteers, is open on Thursdays from 10:30 a.m. to 2:30 p.m. You may call the library or write to our email to request a book, DVD or CD. The item can be picked up at the shul office during its hours of operation: Monday-Thursday 8:30 a.m. – 4:30 p.m. & Friday 8:30 a.m. – 2:00 p.m.','A service in Conservative Synagogue Kehillat Beth Israel. Kehillat Beth Israel is proud to offer free access to the exceptional Malca Pass Library, an impressive collection of texts, DVDs and music CDs in almost every area of Judaica. Books include a large up-to-date collection of fiction on Jewish themes or by Jewish authors as well as non-fiction materials such as biography, art, Jewish religious practice, holy days, history and food. Named in memory of a dedicated Agudath Israel Congregation Sisterhood President and volunteer, the library has established a vast collection over its 50+ year history.\n\nAn associated program, the Malca Pass Library Book Discussion Group meets periodically throughout the year. Both the library and the book group are open to the entire Ottawa community.\n\nThe library’s catalog is available online.\n','approved','irishkaakk@gmail.co','2025-03-20 02:52:25',_binary '\0',1310,_binary '\0',NULL,'','',NULL,'buses 53, 81, 114: stop Laperrière / Kirkwood or Kirkwood / Coldrey'),(1461,NULL,'Caldwell Family Centre',1,'1475 Caldwell Avenue','K1Z 5L6',-75.736751,45.372839,_binary '','assistant','6132762640999','luc.lalande@gmail.com|llalande@carlingtonchc.org','carlingtonchc.org','','Every Wednesday from 5pm to 6pm','Weekly AI Art with seniors activity','pending','luc.lalande@gmail.co','2025-03-27 17:47:01',_binary '\0',NULL,_binary '','English|French','','','On site','');
/*!40000 ALTER TABLE `assetsDraft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Reference_4` (`parentId`),
  KEY `idx_categories` (`id`,`name`),
  FULLTEXT KEY `idx_category_name` (`name`),
  CONSTRAINT `FK_Reference_4` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='categories for asset';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--
-- ORDER BY:  `id`

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `name`, `level`, `parentId`, `description`) VALUES (1,'Administrative support',1,NULL,'Support services for administration'),(2,'Community events',1,NULL,'Events happening in the community'),(3,'Transportation',1,NULL,'Transport-related services'),(4,'Community organizations',1,NULL,'Various community organizations'),(5,'Community places',1,NULL,'Public community locations'),(6,'Private services',1,NULL,'Privately offered services'),(7,'Health Services',1,NULL,'Health-related services'),(8,'Social Services',1,NULL,'Various social support services'),(9,'Food Security',1,NULL,'Food assistance programs'),(10,'Basic Needs',1,NULL,'Essential needs like clothing and furniture'),(11,'Hobby',1,NULL,'Recreational activities and hobbies'),(12,'Sport and recreation',1,NULL,'Sports and physical activities'),(13,'Skill training',2,1,NULL),(14,'Employment',2,1,NULL),(15,'Housing',2,1,NULL),(16,'Childcare',2,1,NULL),(17,'Legal',2,1,NULL),(18,'Income tax',2,1,NULL),(19,'ESL',2,1,NULL),(20,'Government representatives',2,4,NULL),(21,'Charitable organizations',2,4,NULL),(22,'Community and Recreational Centers',2,4,NULL),(23,'Libraries',2,4,NULL),(24,'Health organizations',2,4,NULL),(25,'Governmental web-services',2,4,NULL),(26,'Parks',2,5,NULL),(27,'Green Spaces',2,5,NULL),(28,'Playgrounds',2,5,NULL),(29,'Schools',2,5,NULL),(30,'Bike repair',2,6,NULL),(31,'Computer café',2,6,NULL),(32,'Car-sharing and similar transportation sharing services',2,6,NULL),(33,'Rentals (gear, tools)',2,6,NULL),(34,'Mental Health',2,7,NULL),(35,'Primary Health Care',2,7,NULL),(36,'Harm Reduction',2,7,NULL),(37,'Counselling',2,7,NULL),(38,'Walk-in Counselling',2,7,NULL),(39,'Pregnancy',2,7,NULL),(40,'Sexual Health',2,7,NULL),(41,'Support Group',2,7,NULL),(42,'Crisis',2,7,NULL),(43,'Home support',2,7,NULL),(44,'Social prescribing',2,7,NULL),(45,'Community Organization',2,8,NULL),(46,'Crisis intake',2,8,NULL),(47,'Peer support',2,8,NULL),(48,'Family Peer Support',2,8,NULL),(49,'Drop-in programming',2,8,NULL),(50,'Day programming',2,8,NULL),(51,'Playgroups',2,8,NULL),(52,'Baby Cupboard',2,9,NULL),(53,'Breakfast program',2,9,NULL),(54,'Lunch program',2,9,NULL),(55,'Emergency Food',2,9,NULL),(56,'Food Bank',2,9,NULL),(57,'Food Cupboard',2,9,NULL),(58,'Community Kitchen',2,9,NULL),(59,'Community Fridge',2,9,NULL),(60,'Clothing',2,10,NULL),(61,'Furniture',2,10,NULL),(62,'Donations',2,10,NULL),(63,'Hygiene products',2,10,NULL),(64,'Cards & Games',2,11,NULL),(65,'Arts & Crafts',2,11,NULL),(66,'Knitting & Sewing',2,11,NULL),(67,'Gardening',2,11,NULL),(68,'Nature',2,11,NULL),(69,'Cooking class',2,11,NULL),(70,'Music',2,11,NULL),(71,'Singing',2,11,NULL),(72,'Drama',2,11,NULL),(73,'Dance',2,11,NULL),(74,'Outdoors',2,11,NULL),(75,'Book clubs',2,11,NULL),(76,'Social clubs',2,11,NULL),(77,'Walking groups',2,12,NULL),(78,'Soccer',2,12,NULL),(79,'Swimming',2,12,NULL),(80,'Sports',2,12,NULL),(81,'Athletics',2,12,NULL),(82,'Exercise',2,12,NULL),(83,'Yoga',2,12,NULL),(84,'Martial arts',2,12,NULL),(85,'Gym',2,12,NULL),(86,'Tracking',2,12,NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cityOptions`
--

DROP TABLE IF EXISTS `cityOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cityOptions` (
  `code` int NOT NULL AUTO_INCREMENT,
  `provinceCode` varchar(5) DEFAULT NULL,
  `cityName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `FK_Reference_8` (`provinceCode`),
  CONSTRAINT `FK_Reference_8` FOREIGN KEY (`provinceCode`) REFERENCES `provinceOptions` (`code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cityOptions`
--
-- ORDER BY:  `code`

LOCK TABLES `cityOptions` WRITE;
/*!40000 ALTER TABLE `cityOptions` DISABLE KEYS */;
INSERT INTO `cityOptions` (`code`, `provinceCode`, `cityName`) VALUES (1,'ON','Ottawa'),(2,'ON','Test City'),(3,'ON','Test City Second'),(4,'ON','New York'),(5,'ON','Los Angeles');
/*!40000 ALTER TABLE `cityOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailyScheduleDraft`
--

DROP TABLE IF EXISTS `dailyScheduleDraft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailyScheduleDraft` (
  `id` int NOT NULL,
  `draftId` int DEFAULT NULL,
  `fromTime` datetime NOT NULL COMMENT 'start from time',
  `toTime` datetime NOT NULL COMMENT 'end to time',
  `isEnable` bit(1) DEFAULT NULL COMMENT 'is enable or not',
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastupdateBy` int DEFAULT NULL COMMENT 'last updated by user(id)',
  `lastupdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated date',
  PRIMARY KEY (`id`),
  KEY `FK_Reference_9` (`draftId`),
  CONSTRAINT `FK_Reference_9` FOREIGN KEY (`draftId`) REFERENCES `assetsDraft` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='schedule by day, show the Monthly schedule\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailyScheduleDraft`
--
-- ORDER BY:  `id`

LOCK TABLES `dailyScheduleDraft` WRITE;
/*!40000 ALTER TABLE `dailyScheduleDraft` DISABLE KEYS */;
/*!40000 ALTER TABLE `dailyScheduleDraft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailySchedules`
--

DROP TABLE IF EXISTS `dailySchedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailySchedules` (
  `id` int NOT NULL,
  `assetId` int DEFAULT NULL,
  `fromTime` datetime NOT NULL COMMENT 'start from time',
  `toTime` datetime NOT NULL COMMENT 'end to time',
  `isEnable` bit(1) DEFAULT NULL COMMENT 'is enable or not',
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastupdateBy` int DEFAULT NULL COMMENT 'last updated by user(id)',
  `lastupdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated date',
  PRIMARY KEY (`id`),
  KEY `FK_Reference_7` (`assetId`),
  CONSTRAINT `FK_Reference_7` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='schedule by day, show the Monthly schedule\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailySchedules`
--
-- ORDER BY:  `id`

LOCK TABLES `dailySchedules` WRITE;
/*!40000 ALTER TABLE `dailySchedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `dailySchedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dateOptions`
--

DROP TABLE IF EXISTS `dateOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dateOptions` (
  `code` varchar(5) NOT NULL,
  `date` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dateOptions`
--
-- ORDER BY:  `code`

LOCK TABLES `dateOptions` WRITE;
/*!40000 ALTER TABLE `dateOptions` DISABLE KEYS */;
INSERT INTO `dateOptions` (`code`, `date`) VALUES ('Fr','Friday'),('Mon','Monday'),('Sat','Saturday'),('Sun','Sunday'),('Th','Thursday'),('Tue','Tuesday'),('Wed','Wednesday');
/*!40000 ALTER TABLE `dateOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `draftCategLinks`
--

DROP TABLE IF EXISTS `draftCategLinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `draftCategLinks` (
  `assetDraftId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`assetDraftId`,`categoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `draftCategLinks_ibfk_1` FOREIGN KEY (`assetDraftId`) REFERENCES `assetsDraft` (`id`),
  CONSTRAINT `draftCategLinks_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `draftCategLinks`
--
-- ORDER BY:  `assetDraftId`,`categoryId`

LOCK TABLES `draftCategLinks` WRITE;
/*!40000 ALTER TABLE `draftCategLinks` DISABLE KEYS */;
INSERT INTO `draftCategLinks` (`assetDraftId`, `categoryId`) VALUES (1058,29),(1310,21),(1311,51),(1312,49),(1313,2),(1314,45),(1315,56),(1316,23),(1461,22);
/*!40000 ALTER TABLE `draftCategLinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinceOptions`
--

DROP TABLE IF EXISTS `provinceOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinceOptions` (
  `code` varchar(50) NOT NULL,
  `provicneName` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinceOptions`
--
-- ORDER BY:  `code`

LOCK TABLES `provinceOptions` WRITE;
/*!40000 ALTER TABLE `provinceOptions` DISABLE KEYS */;
INSERT INTO `provinceOptions` (`code`, `provicneName`) VALUES ('ON','Ontario');
/*!40000 ALTER TABLE `provinceOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL COMMENT 'role name',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='roles table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--
-- ORDER BY:  `id`

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`) VALUES (1,'admin'),(2,'navigator');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selectOptions`
--

DROP TABLE IF EXISTS `selectOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selectOptions` (
  `code` varchar(5) NOT NULL COMMENT 'option code(for reference)',
  `name` varchar(100) DEFAULT NULL COMMENT 'display name',
  `groupCode` varchar(50) DEFAULT NULL COMMENT 'for grouping',
  `isEnable` bit(1) DEFAULT b'1' COMMENT 'enable or not',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selectOptions`
--
-- ORDER BY:  `code`

LOCK TABLES `selectOptions` WRITE;
/*!40000 ALTER TABLE `selectOptions` DISABLE KEYS */;
INSERT INTO `selectOptions` (`code`, `name`, `groupCode`, `isEnable`) VALUES ('00001','English','A1',_binary ''),('00002','Franch','A1',_binary ''),('00003','Bilingual','A1',_binary ''),('00004','Create','A2',_binary ''),('00005','Update','A2',_binary ''),('00006','Pending','A3',_binary ''),('00007','Approved','A3',_binary ''),('00008','Rejected','A3',_binary ''),('00009','In-Preson','A4',_binary ''),('00010','Online','A4',_binary ''),('00011','Once','A5',_binary ''),('00012','Monthly','A5',_binary ''),('00013','Weekly','A5',_binary ''),('00014','Daily','A5',_binary ''),('00015','Always On Demand','A5',_binary '');
/*!40000 ALTER TABLE `selectOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL COMMENT 'firstName',
  `lastName` varchar(50) DEFAULT NULL COMMENT 'firstName',
  `email` varchar(100) DEFAULT NULL COMMENT 'email',
  `password` varchar(255) DEFAULT NULL,
  `isEnable` bit(1) DEFAULT NULL COMMENT 'is enable or not',
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastUpdateBy` int DEFAULT NULL,
  `lastUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `jobTitle` varchar(100) DEFAULT NULL COMMENT 'Job title',
  PRIMARY KEY (`id`),
  KEY `FK_Reference_2` (`roleId`),
  CONSTRAINT `FK_Reference_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--
-- ORDER BY:  `id`

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `roleId`, `firstName`, `lastName`, `email`, `password`, `isEnable`, `createdBy`, `createDate`, `lastUpdateBy`, `lastUpdateDate`, `jobTitle`) VALUES (2,1,'Super','Admin','catsformapapp@gmail.com','$2a$10$f1s/p9.J6hs1SJLUCQBsF.hBfQUpbXrCUMrhsWyMqW/y0nfxJDQI.',_binary '',1,'2025-02-08 23:39:34',2,'2025-02-12 21:38:52','admin'),(5,2,'Irina','Salikhova','irishkaakk@gmail.com','$2a$10$608jY.4z0gGlHDxdax.kw.0XyIHw8TvYomMd1ghe5aQlVsi1YJuau',_binary '',2,'2025-02-10 02:33:16',2,'2025-02-18 03:11:46','student'),(7,1,'Hung','Lai','lai00055@algonquinlive.com','$2a$10$jPxMGmu/pwOx1eDu1cUcWeVY0/9a4tXncuBrKNTTueLA38WXMVw8y',_binary '',2,'2025-02-10 04:00:26',10,'2025-02-11 23:57:55','student'),(8,1,'Mahima','Sawhney','sawh0006@algonquinlive.com','$2a$10$ZmOhz7VOzJOqSiLzTGoKVu8xQQi8Ud3LcimcrVlSpSow2nskDC8Le',_binary '',2,'2025-02-10 04:05:09',8,'2025-02-10 21:52:42','student'),(9,1,'Samuel','Li','li000694@algonquinlive.com','$2a$10$UKuOBCsOPfdvy/XH36IwM.M1T/TgqE1SWewyJjYI0LTXc4ObQJp16',_binary '',2,'2025-02-10 13:21:31',9,'2025-03-03 20:13:44','student'),(10,1,'Irishka','Salikhova','sali0104@algonquinlive.com','$2a$10$ThOyfjgQCt0n4JOxXE1H4OcjaOA39wq.DaobbkFBw/0N4k4dp7baW',_binary '',2,'2025-02-10 13:41:21',2,'2025-02-20 01:04:51','student'),(11,2,'Mahima','Sawhney','sawhneymahima5@gmail.com','$2a$10$3AvGQR3SOVCYEwSSWBf9xewL/O8.dp5Pc.fiJClVxIXRBM0tLGOs2',_binary '',8,'2025-02-10 21:57:04',8,'2025-04-06 03:22:57','student'),(12,2,'Luc','Lalande','luc.lalande@gmail.com','$2a$10$LvsPEtRNQ4RNjyhH/xBriusRj2qhfBO4ENqV8EkSDE1vLBY/GYr.i',_binary '',10,'2025-02-12 17:25:50',10,'2025-03-27 17:48:52','Innovator-in-Residence cool!'),(16,2,'Hung','Lai','lpch0411@gmail.com','$2a$10$lheIulbVg/5k.txk/Sfz7OfqRo8FfD9R2MTQ18YY73PcIM5ZQbplW',_binary '',7,'2025-02-19 18:40:06',16,'2025-02-27 01:33:14','sdsas'),(17,1,'dsa','asd','ihkaakk@gmail.com',NULL,_binary '\0',10,'2025-02-20 01:12:03',10,'2025-02-20 01:12:03','dd'),(18,2,'Hung','Lai','chanhung041103@gmail.com',NULL,_binary '',7,'2025-02-27 01:22:56',7,'2025-03-03 01:17:51','student'),(19,1,'Ahmet','Kapici','akapici@carlingtonchc.org',NULL,_binary '',10,'2025-02-27 16:26:55',10,'2025-02-27 16:27:22','admin'),(20,1,'Hilary','Rose','hrose@carlingtonchc.org',NULL,_binary '',10,'2025-02-27 17:07:58',10,'2025-02-27 17:08:09','navigator'),(21,1,'sda','asda','abc@abc.com',NULL,_binary '\0',7,'2025-03-06 00:23:20',7,'2025-03-06 01:56:41','ada'),(22,2,'Hung','Lai','412341@1.com',NULL,_binary '\0',7,'2025-03-06 02:11:54',7,'2025-03-24 20:57:40','student'),(23,1,'Iri','Salhova','irishkkk@gmail.com',NULL,_binary '\0',2,'2025-03-10 00:14:52',2,'2025-03-10 00:14:52','ff');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weeklyScheduleDraft`
--

DROP TABLE IF EXISTS `weeklyScheduleDraft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weeklyScheduleDraft` (
  `id` int NOT NULL,
  `draftId` int DEFAULT NULL COMMENT 'reference assetid',
  `date` varchar(5) DEFAULT NULL COMMENT 'date for schedule',
  `fromTime` varchar(10) DEFAULT NULL COMMENT 'schedule start time(like: 13:30)',
  `toTime` varchar(10) DEFAULT NULL COMMENT 'schedule end time(like: 13:30)',
  `isEnable` bit(1) DEFAULT NULL COMMENT 'is enable or not',
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastupdateBy` int DEFAULT NULL COMMENT 'last updated by user(id)',
  `lastupdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated date',
  PRIMARY KEY (`id`),
  KEY `FK_Reference_10` (`draftId`),
  CONSTRAINT `FK_Reference_10` FOREIGN KEY (`draftId`) REFERENCES `assetsDraft` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='store the weekly schedule for public to know\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weeklyScheduleDraft`
--
-- ORDER BY:  `id`

LOCK TABLES `weeklyScheduleDraft` WRITE;
/*!40000 ALTER TABLE `weeklyScheduleDraft` DISABLE KEYS */;
/*!40000 ALTER TABLE `weeklyScheduleDraft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weeklySchedules`
--

DROP TABLE IF EXISTS `weeklySchedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weeklySchedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetId` int DEFAULT NULL COMMENT 'reference assetid',
  `date` varchar(5) DEFAULT NULL COMMENT 'date for schedule',
  `fromTime` varchar(10) DEFAULT NULL COMMENT 'schedule start time(like: 13:30)',
  `toTime` varchar(10) DEFAULT NULL COMMENT 'schedule end time(like: 13:30)',
  `isEnable` bit(1) DEFAULT NULL COMMENT 'is enable or not',
  `createdBy` int DEFAULT NULL COMMENT 'created by user(id)',
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
  `lastupdateBy` int DEFAULT NULL COMMENT 'last updated by user(id)',
  `lastupdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated date',
  PRIMARY KEY (`id`),
  KEY `Reference_3_idx` (`assetId`),
  CONSTRAINT `Reference_3` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='store the weekly schedule for public to know\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weeklySchedules`
--
-- ORDER BY:  `id`

LOCK TABLES `weeklySchedules` WRITE;
/*!40000 ALTER TABLE `weeklySchedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `weeklySchedules` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 14:04:59
