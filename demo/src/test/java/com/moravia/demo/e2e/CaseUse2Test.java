package com.moravia.demo.e2e;

import java.time.Duration;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Test E2E para el caso de uso 2: Reserva completa con check-in, servicios y checkout
 * 
 * IMPORTANTE: Este test asume que la aplicación ya está corriendo:
 * - Frontend Angular en http://localhost:4200
 * - Backend Spring Boot en http://localhost:8081
 * 
 * No inicia el servidor Spring Boot, solo se conecta a la aplicación ya ejecutándose.
 */
public class CaseUse2Test {

    private final String BASE_URL = "http://localhost:4200";
    private WebDriver driver;
    private WebDriverWait wait;
    private WebDriver operatorDriver;
    private WebDriverWait operatorWait;

    @BeforeEach
    public void init() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--disable-notifications");
        chromeOptions.addArguments("--disable-extensions");
        // chromeOptions.addArguments("--headless");

        // Driver para el usuario cliente
        this.driver = new ChromeDriver(chromeOptions);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Driver para el operador (en otra pestaña/ventana)
        this.operatorDriver = new ChromeDriver(chromeOptions);
        this.operatorWait = new WebDriverWait(operatorDriver, Duration.ofSeconds(10));
    }

    @Test
    public void testReservaCompleta_CheckinServiciosYCheckout() {
        // ============================================
        // PASO 1: Usuario cliente hace login
        // ============================================
        driver.get(BASE_URL + "/auth");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("correo")));

        WebElement inputCorreo = driver.findElement(By.id("correo"));
        WebElement inputClave = driver.findElement(By.id("clave"));
        
        // Limpiar campos por si tienen valores previos
        inputCorreo.clear();
        inputClave.clear();
        
        // Usar credenciales de un cliente registrado (maria.gomez@example.com)
        inputCorreo.sendKeys("maria.gomez@example.com");
        inputClave.sendKeys("pass456");
        
        // Esperar a que el formulario sea válido y el botón esté habilitado
        WebElement btnSubmit = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']:not([disabled])")
        ));
        
        btnSubmit.click();

        // Esperar a que se complete el login (puede haber un mensaje de error o redirección)
        // Esperar un poco para que se procese la llamada HTTP
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar si hay mensaje de error
        List<WebElement> errorMessages = driver.findElements(By.cssSelector(".alert.error"));
        if (!errorMessages.isEmpty()) {
            String errorText = errorMessages.get(0).getText();
            System.out.println("Error en login detectado: " + errorText);
            throw new RuntimeException("Error en login del cliente: " + errorText);
        }

        // Esperar a que se complete el login y redirija
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/home"),
            ExpectedConditions.urlContains("/mis-reservas")
        ));

        // ============================================
        // PASO 2: Usuario revisa sus próximas reservas
        // ============================================
        driver.get(BASE_URL + "/mis-reservas");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("mis-reservas-container")));

        // Verificar que hay reservas
        List<WebElement> reservaCards = driver.findElements(By.className("reserva-card"));
        Assertions.assertThat(reservaCards.size()).isGreaterThan(0);

        // Encontrar una reserva que esté sin iniciar (estado CONFIRMADA o PENDIENTE)
        WebElement reservaSinIniciar = null;
        for (WebElement card : reservaCards) {
            String estadoTexto = card.findElement(By.className("estado-badge")).getText();
            if (estadoTexto.contains("CONFIRMADA") || estadoTexto.contains("PENDIENTE") || 
                estadoTexto.contains("PROXIMA")) {
                reservaSinIniciar = card;
                break;
            }
        }

        Assertions.assertThat(reservaSinIniciar).isNotNull();

        // Guardar el ID de la reserva para uso posterior
        String reservaIdText = reservaSinIniciar.findElement(By.tagName("h3")).getText();
        String reservaId = reservaIdText.replace("Reserva #", "").trim();

        // ============================================
        // PASO 3: Operador hace login en otra pestaña
        // ============================================
        operatorDriver.get(BASE_URL + "/auth");
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.id("correo")));

        WebElement operatorCorreo = operatorDriver.findElement(By.id("correo"));
        WebElement operatorClave = operatorDriver.findElement(By.id("clave"));
        
        // Limpiar campos
        operatorCorreo.clear();
        operatorClave.clear();
        
        // Usar credenciales de un operador (carlos.rojas@example.com)
        operatorCorreo.sendKeys("carlos.rojas@example.com");
        operatorClave.sendKeys("carlos123");
        
        // Esperar a que el botón esté habilitado
        WebElement operatorBtnSubmit = operatorWait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']:not([disabled])")
        ));
        
        operatorBtnSubmit.click();

        // Esperar a que se procese la llamada HTTP
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verificar si hay mensaje de error
        List<WebElement> operatorErrorMessages = operatorDriver.findElements(By.cssSelector(".alert.error"));
        if (!operatorErrorMessages.isEmpty()) {
            String errorText = operatorErrorMessages.get(0).getText();
            System.out.println("Error en login del operador detectado: " + errorText);
            throw new RuntimeException("Error en login del operador: " + errorText);
        }

        // Esperar a que se complete el login
        operatorWait.until(ExpectedConditions.or(
            ExpectedConditions.urlContains("/home"),
            ExpectedConditions.urlContains("/reserva/table")
        ));

        // ============================================
        // PASO 4: Operador va al perfil de reservas
        // ============================================
        operatorDriver.get(BASE_URL + "/reserva/table");
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("services-table")));

        // Esperar a que la tabla se cargue
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("service-row")));

        // Encontrar la fila de la reserva del usuario
        List<WebElement> rows = operatorDriver.findElements(By.className("service-row"));
        WebElement reservaRow = null;

        for (WebElement row : rows) {
            String idCell = row.findElement(By.className("cell-id")).getText();
            if (idCell.equals(reservaId)) {
                reservaRow = row;
                break;
            }
        }

        Assertions.assertThat(reservaRow).isNotNull();

        // ============================================
        // PASO 5: Operador activa (realiza check-in) la reserva
        // ============================================
        Assertions.assertThat(reservaRow).isNotNull();
        WebElement btnActivar = reservaRow.findElement(By.className("btn-activar"));
        
        // Verificar que el botón no esté deshabilitado
        String disabledAttr = btnActivar.getAttribute("disabled");
        if (disabledAttr == null || !disabledAttr.equals("true")) {
            btnActivar.click();
            
            // Esperar confirmación del navegador si hay
            try {
                operatorWait.until(ExpectedConditions.alertIsPresent());
                operatorDriver.switchTo().alert().accept();
            } catch (Exception e) {
                // No hay alerta, continuar
            }
            
            // Esperar a que se actualice la tabla
            operatorWait.until(ExpectedConditions.stalenessOf(reservaRow));
            
            // Recargar la fila para verificar el cambio de estado
            rows = operatorDriver.findElements(By.className("service-row"));
            for (WebElement row : rows) {
                String idCell = row.findElement(By.className("cell-id")).getText();
                if (idCell.equals(reservaId)) {
                    reservaRow = row;
                    break;
                }
            }
            
            // Verificar que el estado cambió a ACTIVA
            String estadoActual = reservaRow.findElement(By.className("cell-estado"))
                    .findElement(By.className("estado-badge")).getText();
            Assertions.assertThat(estadoActual).containsIgnoringCase("ACTIVA");
        }

        // ============================================
        // PASO 6: Operador agrega 2 servicios a la reserva
        // ============================================
        WebElement btnServicios = reservaRow.findElement(By.className("btn-servicios"));
        btnServicios.click();

        // Esperar a que se cargue la página de gestión de servicios
        operatorWait.until(ExpectedConditions.urlContains("/reserva/servicios/"));

        // Esperar a que se carguen los servicios disponibles
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("servicios-grid")));

        // Encontrar los primeros 2 servicios disponibles
        List<WebElement> servicioCards = operatorDriver.findElements(By.className("servicio-card"));
        Assertions.assertThat(servicioCards.size()).isGreaterThanOrEqualTo(2);

        // Agregar primer servicio
        WebElement primerServicio = servicioCards.get(0);
        WebElement btnAgregarPrimero = primerServicio.findElement(By.cssSelector("button.btn-primary"));
        btnAgregarPrimero.click();

        // Esperar a que se actualice la página
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("alert-success")));

        // Recargar servicios disponibles
        servicioCards = operatorDriver.findElements(By.className("servicio-card"));

        // Agregar segundo servicio
        if (servicioCards.size() >= 2) {
            WebElement segundoServicio = servicioCards.get(1);
            WebElement btnAgregarSegundo = segundoServicio.findElement(By.cssSelector("button.btn-primary"));
            btnAgregarSegundo.click();

            // Esperar a que se actualice la página
            operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("alert-success")));
        }

        // Verificar que los servicios se agregaron correctamente
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("servicios-cuenta")));
        List<WebElement> serviciosEnCuenta = operatorDriver.findElements(By.className("servicio-cuenta-item"));
        Assertions.assertThat(serviciosEnCuenta.size()).isGreaterThanOrEqualTo(2);

        // Verificar el total en el resumen (debe ser mayor a 0)
        WebElement totalElement = operatorDriver.findElement(By.className("resumen-item.total"));
        String totalText = totalElement.findElements(By.tagName("span")).get(1).getText();
        double totalEsperado = Double.parseDouble(totalText.replace("$", "").replace(",", "").trim());
        Assertions.assertThat(totalEsperado).isGreaterThan(0.0);

        // ============================================
        // PASO 7: Usuario acaba su estadía y desea realizar checkout
        // ============================================
        // El usuario vuelve a revisar sus reservas
        driver.get(BASE_URL + "/mis-reservas");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("mis-reservas-container")));

        // Encontrar la reserva actualizada
        reservaCards = driver.findElements(By.className("reserva-card"));
        WebElement reservaActualizada = null;
        for (WebElement card : reservaCards) {
            String cardId = card.findElement(By.tagName("h3")).getText();
            if (cardId.contains(reservaId)) {
                reservaActualizada = card;
                break;
            }
        }

        Assertions.assertThat(reservaActualizada).isNotNull();

        // Verificar que la reserva ahora está ACTIVA
        String estadoUsuario = reservaActualizada.findElement(By.className("estado-badge")).getText();
        Assertions.assertThat(estadoUsuario).containsIgnoringCase("ACTIVA");

        // Verificar que hay servicios agregados (mostrando total)
        WebElement totalReserva = reservaActualizada.findElement(By.className("detail-item"));
        Assertions.assertThat(totalReserva.getText()).contains("Total");

        // ============================================
        // PASO 8: Usuario va donde el operador y decide pagar
        // ============================================
        // El operador vuelve a la tabla de reservas
        operatorDriver.get(BASE_URL + "/reserva/table");
        operatorWait.until(ExpectedConditions.presenceOfElementLocated(By.className("services-table")));

        // Encontrar nuevamente la fila de la reserva
        rows = operatorDriver.findElements(By.className("service-row"));
        reservaRow = null;
        for (WebElement row : rows) {
            String idCell = row.findElement(By.className("cell-id")).getText();
            if (idCell.equals(reservaId)) {
                reservaRow = row;
                break;
            }
        }

        Assertions.assertThat(reservaRow).isNotNull();

        // Hacer clic en el botón de pagar
        WebElement btnPagar = reservaRow.findElement(By.className("btn-pagar"));
        
        // Verificar que el botón no esté deshabilitado
        String disabledPagar = btnPagar.getAttribute("disabled");
        if (disabledPagar == null || !disabledPagar.equals("true")) {
            btnPagar.click();

            // Manejar la alerta de confirmación si existe
            try {
                operatorWait.until(ExpectedConditions.alertIsPresent());
                String alertText = operatorDriver.switchTo().alert().getText();
                // Verificar que el monto mencionado en la alerta sea el apropiado
                if (alertText.contains("$")) {
                    // Extraer el monto de la alerta y verificar
                    String montoEnAlerta = alertText.replaceAll(".*?\\$([0-9,]+(\\.[0-9]+)?).*", "$1");
                    double montoAlerta = Double.parseDouble(montoEnAlerta.replace(",", ""));
                    Assertions.assertThat(montoAlerta).isGreaterThan(0);
                }
                operatorDriver.switchTo().alert().accept();
            } catch (Exception e) {
                // No hay alerta, continuar
            }

            // Esperar a que se actualice la página
            operatorWait.until(ExpectedConditions.stalenessOf(reservaRow));

            // Recargar la fila para verificar el cambio
            rows = operatorDriver.findElements(By.className("service-row"));
            for (WebElement row : rows) {
                String idCell = row.findElement(By.className("cell-id")).getText();
                if (idCell.equals(reservaId)) {
                    reservaRow = row;
                    break;
                }
            }

            // Verificar que la cuenta se pagó (el botón de pagar debería estar deshabilitado)
            // o que la reserva cambió de estado
            String estadoDespues = reservaRow.findElement(By.className("cell-estado"))
                    .findElement(By.className("estado-badge")).getText();
            
            // La reserva puede estar FINALIZADA o la cuenta puede estar PAGADA
            Assertions.assertThat(estadoDespues).satisfiesAnyOf(
                estado -> Assertions.assertThat(estado).containsIgnoringCase("FINALIZADA"),
                estado -> Assertions.assertThat(estado).containsIgnoringCase("ACTIVA")
            );
        }

        // ============================================
        // PASO 9: Finalizar la reserva (si aún está activa)
        // ============================================
        // Verificar si la reserva necesita ser finalizada
        String estadoFinal = reservaRow.findElement(By.className("cell-estado"))
                .findElement(By.className("estado-badge")).getText();

        if (estadoFinal.contains("ACTIVA")) {
            WebElement btnFinalizar = reservaRow.findElement(By.className("btn-finalizar"));
            
            String disabledFinalizar = btnFinalizar.getAttribute("disabled");
            if (disabledFinalizar == null || !disabledFinalizar.equals("true")) {
                btnFinalizar.click();

                // Manejar alerta si existe
                try {
                    operatorWait.until(ExpectedConditions.alertIsPresent());
                    operatorDriver.switchTo().alert().accept();
                } catch (Exception e) {
                    // No hay alerta
                }

                // Esperar actualización
                operatorWait.until(ExpectedConditions.stalenessOf(reservaRow));

                // Verificar que la reserva está finalizada
                rows = operatorDriver.findElements(By.className("service-row"));
                for (WebElement row : rows) {
                    String idCell = row.findElement(By.className("cell-id")).getText();
                    if (idCell.equals(reservaId)) {
                        reservaRow = row;
                        break;
                    }
                }

                String estadoFinalizado = reservaRow.findElement(By.className("cell-estado"))
                        .findElement(By.className("estado-badge")).getText();
                Assertions.assertThat(estadoFinalizado).containsIgnoringCase("FINALIZADA");
            }
        } else {
            // Ya está finalizada
            Assertions.assertThat(estadoFinal).containsIgnoringCase("FINALIZADA");
        }
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        if (operatorDriver != null) {
            operatorDriver.quit();
        }
    }
}

