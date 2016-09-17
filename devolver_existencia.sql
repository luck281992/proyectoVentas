DELIMITER $$

DROP TRIGGER /*!50032 IF EXISTS */ `examen`.`devolver_existencia`$$

CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `devolver_existencia` AFTER DELETE ON `detalle_venta_producto` 
    FOR EACH ROW BEGIN
	DECLARE NuevaExistencia INTEGER;
	SET NuevaExistencia = (SELECT IFNULL(existencia,0) FROM articulos WHERE id = OLD.producto_id) + OLD.cantidad;
	IF NuevaExistencia > 0 THEN 
		UPDATE articulos SET existencia = NuevaExistencia WHERE id = OLD.producto_id;
	ELSE
		UPDATE articulos SET existencia = 0 WHERE id = OLD.producto_id;
	END IF;
    END;
$$

DELIMITER ;