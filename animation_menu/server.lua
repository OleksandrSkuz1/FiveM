RegisterCommand('addanimation', function(source, args, rawCommand)
    local playerId = source
    local animName = args[1]
    
    if animName then
        TriggerClientEvent('animationMenu:update', playerId, { animName = animName })
    else
        print("No animation name provided")
    end
end, true)
