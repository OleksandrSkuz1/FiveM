local menuIsOpen = false
local quickAccessAnimations = {}

-- Function to open/close the animation menu
function ToggleMenu()
    menuIsOpen = not menuIsOpen
    SendNUIMessage({ type = "toggleMenu", state = menuIsOpen })
    SetNuiFocus(menuIsOpen, menuIsOpen) -- Ensure NUI focus is handled correctly
end

-- Function to open the animation selection menu for a category
function OpenAnimationSelectionMenu(category)
    local animations = Config.Animations[category]
    if animations then
        SendNUIMessage({ type = "openAnimationSelectionMenu", category = category, animations = animations })
    end
end

-- Register a command to open the menu
RegisterCommand('animmenu', function()
    ToggleMenu()
end, false)

-- Register a key mapping for the menu
RegisterKeyMapping('animmenu', 'Toggle Animation Menu', 'keyboard', 'y')

-- Key press to toggle the menu
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if menuIsOpen then
            -- Logic to determine which animation sector is selected based on mouse position
            local cursorX, cursorY = GetNuiCursorPosition()
            SendNUIMessage({ type = "updateCursorPosition", x = cursorX, y = cursorY })
        end
    end
end)

-- Receive events from server
RegisterNetEvent('animationMenu:update')
AddEventHandler('animationMenu:update', function(data)
    SendNUIMessage({
        type = "updateAnimations",
        data = data
    })
end)

-- Receive events from NUI
RegisterNUICallback('selectAnimation', function(data, cb)
    print("Received selectAnimation event with data:", json.encode(data))
    local category = data.category
    local animation = data.animation
    if category and animation then
        if #quickAccessAnimations < 5 then
            table.insert(quickAccessAnimations, animation)
            SendNUIMessage({ type = "updateQuickAccessAnimations", animations = quickAccessAnimations })
        else
            print("Quick access is full")
        end
    end
    cb('ok')
end)

-- Close the menu when focus is lost
RegisterNUICallback('lostFocus', function(data, cb)
    print("Received lostFocus event")
    ToggleMenu()
    cb('ok')
end)





