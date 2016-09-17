DELIMITER $$

CREATE
    /*[DEFINER = { user | CURRENT_USER }]*/
    TRIGGER `examen`.`eliminar_detalle_venta` AFTER DELETE
    ON `examen`.`ventas`
    FOR EACH ROW BEGIN
	DELETE FROM detalle_venta_producto WHERE venta_id = OLD.id;
    END$$

DELIMITER ;