/*
SQLyog Community Edition- MySQL GUI v8.05 
MySQL - 5.6.26 : Database - examen
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`examen` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `examen`;

/*Table structure for table `articulos` */

DROP TABLE IF EXISTS `articulos`;

CREATE TABLE `articulos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(11) NOT NULL,
  `descripcion` text NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `existencia` int(11) NOT NULL,
  `precio` decimal(16,6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `articulos` */

insert  into `articulos`(`id`,`codigo`,`descripcion`,`modelo`,`existencia`,`precio`) values (3,'0001','carro personal','aveo',10,'2000.000000'),(4,'0002','carro veloz y elegante','civic',4,'3000.000000'),(7,'0003','camioneta grande','chevrolet',10,'5000.000000');

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) NOT NULL,
  `rfc` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

/*Data for the table `clientes` */

insert  into `clientes`(`id`,`numero`,`nombre`,`apellido_paterno`,`apellido_materno`,`rfc`) values (10,7,'jesus javier','sanchez ','guerrero','ASDSADFRE12'),(12,8,'abigail rosario','paredez','zamora','SDASDASD123'),(13,9,'alonso','burgara','lopez','SADASDD213');

/*Table structure for table `configuracion` */

DROP TABLE IF EXISTS `configuracion`;

CREATE TABLE `configuracion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasa_financiamiento` decimal(16,2) NOT NULL,
  `porcentaje_enganche` int(3) NOT NULL,
  `plazo` int(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `configuracion` */

insert  into `configuracion`(`id`,`tasa_financiamiento`,`porcentaje_enganche`,`plazo`) values (19,'2.80',20,12);

/*Table structure for table `detalle_venta_producto` */

DROP TABLE IF EXISTS `detalle_venta_producto`;

CREATE TABLE `detalle_venta_producto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `precio_total` decimal(16,6) NOT NULL,
  `importe` decimal(16,6) NOT NULL,
  `venta_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

/*Data for the table `detalle_venta_producto` */

/*Table structure for table `ventas` */

DROP TABLE IF EXISTS `ventas`;

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `folio` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `enganche` decimal(16,6) NOT NULL,
  `precio_contado` decimal(16,6) NOT NULL,
  `total_adeudo` decimal(16,6) NOT NULL,
  `importe_abono` decimal(16,6) NOT NULL,
  `importe_ahorro` decimal(16,6) NOT NULL,
  `plazo_abono` int(11) NOT NULL,
  `bonificacion_enganche` decimal(16,6) NOT NULL,
  `total_pagar` decimal(16,6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;

/*Data for the table `ventas` */

/* Trigger structure for table `detalle_venta_producto` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `disminuir_existencia` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `disminuir_existencia` AFTER INSERT ON `detalle_venta_producto` FOR EACH ROW BEGIN
	DECLARE NuevaExistencia INTEGER;
	SET NuevaExistencia = (SELECT IFNULL(existencia,0) FROM articulos WHERE id = NEW.producto_id) - NEW.cantidad;
	IF NuevaExistencia > 0 THEN 
		UPDATE articulos SET existencia = NuevaExistencia WHERE id = NEW.producto_id;
	ELSE
		UPDATE articulos SET existencia = 0 WHERE id = NEW.producto_id;
	END IF;
    END */$$


DELIMITER ;

/* Trigger structure for table `detalle_venta_producto` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `devolver_existencia` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `devolver_existencia` AFTER DELETE ON `detalle_venta_producto` FOR EACH ROW BEGIN
	DECLARE NuevaExistencia INTEGER;
	SET NuevaExistencia = (SELECT IFNULL(existencia,0) FROM articulos WHERE id = OLD.producto_id) + OLD.cantidad;
	IF NuevaExistencia > 0 THEN 
		UPDATE articulos SET existencia = NuevaExistencia WHERE id = OLD.producto_id;
	ELSE
		UPDATE articulos SET existencia = 0 WHERE id = OLD.producto_id;
	END IF;
    END */$$


DELIMITER ;

/* Trigger structure for table `ventas` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `eliminar_detalle_venta` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `eliminar_detalle_venta` AFTER DELETE ON `ventas` FOR EACH ROW BEGIN
	DELETE FROM detalle_venta_producto WHERE venta_id = OLD.id;
    END */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
