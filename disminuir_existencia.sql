DELIMITER $$

DROP TRIGGER /*!50032 IF EXISTS */ `examen`.`disminuir_existencia`$$

CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `disminuir_existencia` AFTER INSERT ON `detalle_venta_producto` 
    FOR EACH ROW BEGIN
	DECLARE NuevaExistencia INTEGER;
	SET NuevaExistencia = (SELECT IFNULL(existencia,0) FROM articulos WHERE id = NEW.producto_id) - NEW.cantidad;
	IF NuevaExistencia > 0 THEN 
		UPDATE articulos SET existencia = NuevaExistencia WHERE id = NEW.producto_id;
	ELSE
		UPDATE articulos SET existencia = 0 WHERE id = NEW.producto_id;
	END IF;
    END;
$$

DELIMITER ;